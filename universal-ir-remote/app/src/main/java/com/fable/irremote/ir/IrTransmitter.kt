package com.fable.irremote.ir

import android.content.Context
import android.hardware.ConsumerIrManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import com.fable.irremote.model.ButtonDef
import com.fable.irremote.model.IrSignal

/**
 * Thin wrapper around [ConsumerIrManager] that clamps the signal to the
 * blaster's supported carrier range and gives haptic feedback on send.
 */
class IrTransmitter(context: Context) {

    private val irManager =
        context.getSystemService(Context.CONSUMER_IR_SERVICE) as? ConsumerIrManager
    private val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator

    val hasEmitter: Boolean
        get() = irManager?.hasIrEmitter() == true

    /** Encodes and transmits a button. Returns null on success, or an error message. */
    fun send(button: ButtonDef): String? {
        val signal = try {
            ProtocolEncoder.encode(button)
        } catch (e: Exception) {
            return "Bad code for '${button.label}': ${e.message}"
        }
        return send(signal)
    }

    fun send(signal: IrSignal): String? {
        val ir = irManager ?: return "No IR service on this device"
        if (!ir.hasIrEmitter()) return "This device has no IR blaster"

        val freq = nearestSupportedFrequency(ir, signal.frequencyHz)
            ?: return "Carrier ${signal.frequencyHz} Hz not supported by this blaster"

        return try {
            ir.transmit(freq, signal.pattern)
            buzz()
            null
        } catch (e: Exception) {
            "Transmit failed: ${e.message}"
        }
    }

    /**
     * IR blasters advertise supported carrier ranges. Most consumer codes sit
     * at 36–40 kHz which everything supports, but if a code's exact carrier
     * falls outside every range we snap to the closest range edge — a few
     * hundred Hz of carrier error is well within receiver tolerance.
     */
    private fun nearestSupportedFrequency(ir: ConsumerIrManager, wanted: Int): Int? {
        val ranges = ir.carrierFrequencies ?: return wanted
        if (ranges.isEmpty()) return wanted
        var best: Int? = null
        var bestDist = Int.MAX_VALUE
        for (r in ranges) {
            val clamped = wanted.coerceIn(r.minFrequency, r.maxFrequency)
            val dist = kotlin.math.abs(clamped - wanted)
            if (dist == 0) return wanted
            if (dist < bestDist) { bestDist = dist; best = clamped }
        }
        return best
    }

    private fun buzz() {
        val v = vibrator ?: return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            v.vibrate(VibrationEffect.createOneShot(15, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            v.vibrate(15)
        }
    }
}
