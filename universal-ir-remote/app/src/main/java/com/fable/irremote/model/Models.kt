package com.fable.irremote.model

import org.json.JSONArray
import org.json.JSONObject

/**
 * A fully-rendered IR signal: carrier frequency in Hz plus an alternating
 * on/off pattern in microseconds, exactly what ConsumerIrManager.transmit()
 * expects.
 */
data class IrSignal(val frequencyHz: Int, val pattern: IntArray) {
    override fun equals(other: Any?): Boolean =
        other is IrSignal && frequencyHz == other.frequencyHz && pattern.contentEquals(other.pattern)

    override fun hashCode(): Int = 31 * frequencyHz + pattern.contentHashCode()
}

/** The IR protocols the app can encode natively. Anything else goes through Pronto/raw. */
enum class Protocol {
    NEC,        // 32-bit: 8-bit address + inverse, 8-bit command + inverse
    NEC_EXT,    // 32-bit: 16-bit address, 8-bit command + inverse
    SAMSUNG,    // NEC timing variant used by Samsung TVs
    SONY12, SONY15, SONY20, // SIRC
    RC5,        // Philips Manchester-coded
    PANASONIC,  // 48-bit Kaseikyo frame, given as full hex value
    PRONTO,     // learned/raw code in Pronto hex format
    RAW,        // "38000:9000,4500,560,..." frequency:comma-separated µs
}

/**
 * A single button on a remote. For protocol-based codes, [address]/[command]
 * carry the parameters; for PANASONIC the 48-bit frame lives in [hexData];
 * for PRONTO/RAW the code string lives in [hexData].
 */
data class ButtonDef(
    val label: String,
    val protocol: Protocol,
    val address: Int = 0,
    val command: Int = 0,
    val hexData: String = "",
) {
    fun toJson(): JSONObject = JSONObject()
        .put("label", label)
        .put("protocol", protocol.name)
        .put("address", address)
        .put("command", command)
        .put("hexData", hexData)

    companion object {
        fun fromJson(o: JSONObject) = ButtonDef(
            label = o.getString("label"),
            protocol = Protocol.valueOf(o.getString("protocol")),
            address = o.optInt("address"),
            command = o.optInt("command"),
            hexData = o.optString("hexData"),
        )
    }
}

/** A remote: a named collection of buttons. */
data class RemoteDef(
    val id: String,
    val name: String,
    val buttons: List<ButtonDef>,
) {
    fun toJson(): JSONObject = JSONObject()
        .put("id", id)
        .put("name", name)
        .put("buttons", JSONArray().apply { buttons.forEach { put(it.toJson()) } })

    companion object {
        fun fromJson(o: JSONObject): RemoteDef {
            val arr = o.getJSONArray("buttons")
            return RemoteDef(
                id = o.getString("id"),
                name = o.getString("name"),
                buttons = (0 until arr.length()).map { ButtonDef.fromJson(arr.getJSONObject(it)) },
            )
        }
    }
}
