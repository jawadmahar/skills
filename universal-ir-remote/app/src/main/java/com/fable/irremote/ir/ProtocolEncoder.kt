package com.fable.irremote.ir

import com.fable.irremote.model.ButtonDef
import com.fable.irremote.model.IrSignal
import com.fable.irremote.model.Protocol

/**
 * Encodes the common consumer IR protocols into carrier-frequency + on/off
 * microsecond patterns. Timings follow the de-facto standards used by LIRC
 * and IRremote.
 *
 * Everything not covered natively can be expressed as a Pronto hex code
 * (see [ProntoParser]) or a raw pattern, which together cover essentially
 * every IR remote in existence.
 */
object ProtocolEncoder {

    fun encode(button: ButtonDef): IrSignal = when (button.protocol) {
        Protocol.NEC -> nec(button.address, button.command, extended = false)
        Protocol.NEC_EXT -> nec(button.address, button.command, extended = true)
        Protocol.SAMSUNG -> samsung(button.address, button.command)
        Protocol.SONY12 -> sony(button.address, button.command, addressBits = 5)
        Protocol.SONY15 -> sony(button.address, button.command, addressBits = 8)
        Protocol.SONY20 -> sony(button.address, button.command, addressBits = 13)
        Protocol.RC5 -> rc5(button.address, button.command)
        Protocol.PANASONIC -> panasonic(button.hexData.trim().removePrefix("0x").toLong(16))
        Protocol.PRONTO -> ProntoParser.parse(button.hexData)
        Protocol.RAW -> raw(button.hexData)
    }

    // ---------------------------------------------------------------- NEC --

    private const val NEC_HDR_MARK = 9000
    private const val NEC_HDR_SPACE = 4500
    private const val NEC_BIT_MARK = 560
    private const val NEC_ZERO_SPACE = 560
    private const val NEC_ONE_SPACE = 1690
    private const val NEC_TRAIL_GAP = 40000

    /**
     * Standard NEC: address, ~address, command, ~command, all LSB-first.
     * Extended NEC: 16-bit address (low byte then high byte) replaces the
     * address/~address pair.
     */
    private fun nec(address: Int, command: Int, extended: Boolean): IrSignal {
        val out = ArrayList<Int>(68)
        out.add(NEC_HDR_MARK); out.add(NEC_HDR_SPACE)
        if (extended) {
            appendLsbBits(out, address and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
            appendLsbBits(out, (address shr 8) and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
        } else {
            appendLsbBits(out, address and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
            appendLsbBits(out, address.inv() and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
        }
        appendLsbBits(out, command and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
        appendLsbBits(out, command.inv() and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
        out.add(NEC_BIT_MARK) // stop bit
        out.add(NEC_TRAIL_GAP)
        return IrSignal(38000, out.toIntArray())
    }

    // ------------------------------------------------------------ Samsung --

    /**
     * Samsung32: NEC-style bits but with a 4.5 ms / 4.5 ms header, and the
     * 8-bit address transmitted twice (no inversion), then command + ~command.
     * This is the "E0E0…" family seen on Samsung TVs.
     */
    private fun samsung(address: Int, command: Int): IrSignal {
        val out = ArrayList<Int>(68)
        out.add(4500); out.add(4500)
        appendLsbBits(out, address and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
        appendLsbBits(out, address and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
        appendLsbBits(out, command and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
        appendLsbBits(out, command.inv() and 0xFF, 8, NEC_BIT_MARK, NEC_ONE_SPACE, NEC_ZERO_SPACE)
        out.add(NEC_BIT_MARK)
        out.add(NEC_TRAIL_GAP)
        return IrSignal(38000, out.toIntArray())
    }

    // --------------------------------------------------------- Sony SIRC --

    /**
     * SIRC at 40 kHz. 2.4 ms header mark, 0.6 ms space; "1" = 1.2 ms mark,
     * "0" = 0.6 ms mark, each followed by a 0.6 ms space. Command (7 bits)
     * then address, LSB-first. Sony receivers expect the frame at least
     * three times, ~45 ms frame to frame, so we bake three repeats in.
     */
    private fun sony(address: Int, command: Int, addressBits: Int): IrSignal {
        val frame = ArrayList<Int>(2 + 2 * (7 + addressBits))
        frame.add(2400); frame.add(600)
        var frameUs = 3000
        fun bit(b: Boolean) {
            val mark = if (b) 1200 else 600
            frame.add(mark); frame.add(600)
            frameUs += mark + 600
        }
        for (i in 0 until 7) bit((command shr i) and 1 == 1)
        for (i in 0 until addressBits) bit((address shr i) and 1 == 1)

        val out = ArrayList<Int>(frame.size * 3)
        repeat(3) { i ->
            out.addAll(frame)
            // Pad the inter-frame space so each frame occupies ~45 ms; the
            // last entry of `frame` is already a 600 µs space we can extend.
            val padding = 45000 - frameUs
            out[out.size - 1] = out[out.size - 1] + padding
            if (i == 2) out[out.size - 1] = 600 // no long trailing gap needed
        }
        return IrSignal(40000, out.toIntArray())
    }

    // ---------------------------------------------------------------- RC5 --

    /**
     * Philips RC5 at 36 kHz, Manchester coded with 889 µs half-bits.
     * 14 bits MSB-first: start "1", field bit (inverted bit 6 of the command,
     * which is "1" for commands 0–63), toggle, 5 address bits, 6 command bits.
     * A logical "1" is space-then-mark, "0" is mark-then-space.
     */
    private fun rc5(address: Int, command: Int, toggle: Boolean = false): IrSignal {
        val bits = ArrayList<Boolean>(14)
        bits.add(true)                        // start
        bits.add(command and 0x40 == 0)       // field: 1 for cmd < 64
        bits.add(toggle)
        for (i in 4 downTo 0) bits.add((address shr i) and 1 == 1)
        for (i in 5 downTo 0) bits.add((command shr i) and 1 == 1)

        // Build (on?, µs) half-bit stream, then merge equal neighbours.
        val halves = ArrayList<Pair<Boolean, Int>>(28)
        for (b in bits) {
            if (b) { halves.add(false to 889); halves.add(true to 889) }
            else { halves.add(true to 889); halves.add(false to 889) }
        }
        val out = ArrayList<Int>(28)
        var idx = 0
        // Drop a leading space (transmission effectively begins at first mark).
        while (idx < halves.size && !halves[idx].first) idx++
        var curOn = true
        var curDur = 0
        while (idx < halves.size) {
            val (on, dur) = halves[idx]
            if (on == curOn) curDur += dur
            else { out.add(curDur); curOn = on; curDur = dur }
            idx++
        }
        if (curDur > 0) out.add(curDur)
        if (out.size % 2 == 0) {
            // Pattern currently ends on a space; fold it into the frame gap.
            out[out.size - 1] = out[out.size - 1] + 89000
        } else {
            out.add(89000) // RC5 frame period is ~114 ms; leave a generous gap
        }
        return IrSignal(36000, out.toIntArray())
    }

    // ---------------------------------------------------- Panasonic 48-bit --

    /**
     * Panasonic (Kaseikyo) 48-bit frame at ~37 kHz, sent MSB-first from a
     * single hex value, e.g. TV power = 0x40040100BCBD.
     * Header 3502/1750 µs; "1" = 502 µs mark + 1244 µs space,
     * "0" = 502 µs mark + 400 µs space.
     */
    private fun panasonic(data: Long): IrSignal {
        val out = ArrayList<Int>(100)
        out.add(3502); out.add(1750)
        for (i in 47 downTo 0) {
            out.add(502)
            out.add(if ((data shr i) and 1L == 1L) 1244 else 400)
        }
        out.add(502)
        out.add(40000)
        return IrSignal(37000, out.toIntArray())
    }

    // ---------------------------------------------------------------- raw --

    /** "38000:9000,4500,560,560,..." — frequency, colon, µs durations. */
    private fun raw(text: String): IrSignal {
        val parts = text.trim().split(":")
        require(parts.size == 2) { "Raw format is FREQ:us,us,us,..." }
        val freq = parts[0].trim().toInt()
        val pattern = parts[1].split(",", " ").filter { it.isNotBlank() }.map { it.trim().toInt() }
        require(pattern.isNotEmpty()) { "Empty raw pattern" }
        return IrSignal(freq, pattern.toIntArray())
    }

    // ------------------------------------------------------------ helpers --

    private fun appendLsbBits(
        out: MutableList<Int>, value: Int, bits: Int,
        mark: Int, oneSpace: Int, zeroSpace: Int,
    ) {
        for (i in 0 until bits) {
            out.add(mark)
            out.add(if ((value shr i) and 1 == 1) oneSpace else zeroSpace)
        }
    }
}
