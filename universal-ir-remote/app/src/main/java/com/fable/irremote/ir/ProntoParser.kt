package com.fable.irremote.ir

import com.fable.irremote.model.IrSignal

/**
 * Parses Pronto hex codes — the lingua franca of IR code databases
 * (irdb, remotecentral.com, Global Caché, manufacturer PDFs, …).
 *
 * Format: space-separated 4-digit hex words.
 *   word 0: 0000 for "learned / raw at a given carrier" (the only kind we
 *           accept; 0100 predefined-format codes are vanishingly rare)
 *   word 1: carrier divisor N, frequency = 1_000_000 / (N * 0.241246) Hz
 *   word 2: number of burst pairs in the one-time sequence
 *   word 3: number of burst pairs in the repeat sequence
 *   rest:   burst pairs (on, off) measured in carrier cycles
 *
 * We transmit the one-time sequence followed by one pass of the repeat
 * sequence, which is what a single button press produces.
 */
object ProntoParser {

    fun parse(pronto: String): IrSignal {
        val words = pronto.trim()
            .split(Regex("[\\s,]+"))
            .filter { it.isNotBlank() }
            .map {
                it.toIntOrNull(16)
                    ?: throw IllegalArgumentException("'$it' is not a hex word")
            }
        require(words.size >= 4) { "Pronto code too short" }
        require(words[0] == 0) { "Only raw (0000) Pronto codes are supported" }
        require(words[1] > 0) { "Invalid carrier divisor" }

        val frequency = (1_000_000.0 / (words[1] * 0.241246)).toInt()
        val usPerCycle = 1_000_000.0 / frequency

        val oncePairs = words[2]
        val repeatPairs = words[3]
        val expected = 4 + 2 * (oncePairs + repeatPairs)
        require(words.size >= expected) {
            "Pronto code truncated: expected $expected words, got ${words.size}"
        }

        val pattern = IntArray(2 * (oncePairs + repeatPairs))
        for (i in pattern.indices) {
            val cycles = words[4 + i]
            pattern[i] = (cycles * usPerCycle).toInt().coerceAtLeast(1)
        }
        require(pattern.isNotEmpty()) { "Pronto code has no burst pairs" }
        return IrSignal(frequency, pattern)
    }

    /** Quick validity check used by the UI before saving a button. */
    fun isValid(pronto: String): Boolean = try {
        parse(pronto); true
    } catch (_: Exception) {
        false
    }
}
