package com.fable.irremote

import com.fable.irremote.ir.ProntoParser
import com.fable.irremote.ir.ProtocolEncoder
import com.fable.irremote.model.ButtonDef
import com.fable.irremote.model.Protocol
import com.fable.irremote.model.RemoteDef
import org.json.JSONObject
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class IrEngineTest {

    /** Decode NEC-timed bits (long space = 1) back into an LSB-first value. */
    private fun decodeNecBits(pattern: IntArray, startIdx: Int, bits: Int): Long {
        var value = 0L
        for (i in 0 until bits) {
            if (pattern[startIdx + 2 * i + 1] > 1000) value = value or (1L shl i)
        }
        return value
    }

    private fun rev8(v: Long) = (0 until 8).fold(0L) { acc, i -> (acc shl 1) or ((v shr i) and 1) }

    @Test
    fun necEncodesLgPower() {
        // LG power: device 0x04, command 0x08 — wire form 20DF10EF
        val s = ProtocolEncoder.encode(ButtonDef("Power", Protocol.NEC, 0x04, 0x08))
        assertEquals(38000, s.frequencyHz)
        assertEquals(2 + 64 + 2, s.pattern.size)
        assertEquals(9000, s.pattern[0])
        assertEquals(4500, s.pattern[1])
        assertEquals(0x04L, decodeNecBits(s.pattern, 2, 8))
        assertEquals(0xFBL, decodeNecBits(s.pattern, 2 + 16, 8))
        assertEquals(0x08L, decodeNecBits(s.pattern, 2 + 32, 8))
        assertEquals(0xF7L, decodeNecBits(s.pattern, 2 + 48, 8))
    }

    @Test
    fun samsungEncodesE0E040BF() {
        // Samsung power: device 0x07, command 0x02 — wire form E0E040BF
        val s = ProtocolEncoder.encode(ButtonDef("Power", Protocol.SAMSUNG, 0x07, 0x02))
        assertEquals(4500, s.pattern[0])
        assertEquals(4500, s.pattern[1])
        assertEquals(0xE0L, rev8(decodeNecBits(s.pattern, 2, 8)))
        assertEquals(0xE0L, rev8(decodeNecBits(s.pattern, 2 + 16, 8)))
        assertEquals(0x40L, rev8(decodeNecBits(s.pattern, 2 + 32, 8)))
        assertEquals(0xBFL, rev8(decodeNecBits(s.pattern, 2 + 48, 8)))
    }

    @Test
    fun sonySirc12PowerHasThree45msFrames() {
        val s = ProtocolEncoder.encode(ButtonDef("Power", Protocol.SONY12, 1, 21))
        assertEquals(40000, s.frequencyHz)
        assertEquals(3 * (2 + 24), s.pattern.size)
        assertEquals(2400, s.pattern[0])
        assertEquals(600, s.pattern[1])
        // Command 21 = 0b0010101, sent LSB-first: 1,0,1,0,1,0,0
        val bits = (0 until 7).map { s.pattern[2 + 2 * it] == 1200 }
        assertEquals(listOf(true, false, true, false, true, false, false), bits)
        // Each of the first two frames must span exactly 45 ms
        assertEquals(45000, s.pattern.take(26).sum())
        assertEquals(45000, s.pattern.drop(26).take(26).sum())
        assertTrue(s.pattern.all { it > 0 })
    }

    @Test
    fun rc5UsesManchesterHalfBits() {
        val s = ProtocolEncoder.encode(ButtonDef("Power", Protocol.RC5, 0, 12))
        assertEquals(36000, s.frequencyHz)
        assertTrue(s.pattern.all { it > 0 })
        // Everything except the trailing frame gap is an 889 µs half-bit or a
        // merged 1778 µs pair.
        assertTrue(s.pattern.dropLast(1).all { it % 889 == 0 && it <= 1778 })
        // Total transmitted time = 14 bits × 1778 µs minus the dropped leading
        // space; the final space is folded into the frame gap.
        val active = s.pattern.dropLast(1).sum() + (s.pattern.last() - 89000).coerceAtLeast(0)
        assertEquals(14 * 1778 - 889, active)
    }

    @Test
    fun panasonicEncodes48BitsMsbFirst() {
        val s = ProtocolEncoder.encode(
            ButtonDef("Power", Protocol.PANASONIC, hexData = "40040100BCBD")
        )
        assertEquals(2 + 96 + 2, s.pattern.size)
        assertEquals(3502, s.pattern[0])
        assertEquals(1750, s.pattern[1])
        // First byte 0x40 MSB-first: bit 47 = 0, bit 46 = 1
        assertTrue(s.pattern[3] < 800)
        assertTrue(s.pattern[5] > 800)
    }

    @Test
    fun prontoParsesHeaderAndFrequency() {
        val s = ProntoParser.parse("0000 006D 0002 0000 0157 00AC 0015 0015")
        assertTrue("freq was ${s.frequencyHz}", s.frequencyHz in 37900..38100)
        assertEquals(4, s.pattern.size)
        assertTrue(s.pattern[0] in 8900..9100) // 0x157 cycles ≈ 9 ms NEC header
        assertTrue(s.pattern[1] in 4450..4550)
    }

    @Test
    fun prontoRejectsInvalidInput() {
        assertFalse(ProntoParser.isValid("hello world"))
        assertFalse(ProntoParser.isValid("0000 006D 0022 0000 0157")) // truncated
        assertFalse(ProntoParser.isValid("0100 006D 0001 0000 0015 0015")) // not raw
        assertTrue(ProntoParser.isValid("0000 006D 0002 0000 0157 00AC 0015 0015"))
    }

    @Test
    fun rawFormatParses() {
        val s = ProtocolEncoder.encode(
            ButtonDef("X", Protocol.RAW, hexData = "38000:9000,4500,560,560")
        )
        assertEquals(38000, s.frequencyHz)
        assertArrayEquals(intArrayOf(9000, 4500, 560, 560), s.pattern)
    }

    @Test
    fun remoteJsonRoundTrips() {
        val remote = RemoteDef(
            "id1", "Bedroom TV",
            listOf(
                ButtonDef("Power", Protocol.SAMSUNG, 0x07, 0x02),
                ButtonDef("Custom", Protocol.PRONTO, hexData = "0000 006D 0002 0000 0157 00AC 0015 0015"),
            )
        )
        assertEquals(remote, RemoteDef.fromJson(JSONObject(remote.toJson().toString())))
    }
}
