package com.fable.irremote.data

import com.fable.irremote.model.ButtonDef
import com.fable.irremote.model.Protocol

/**
 * Built-in code sets for common brands, expressed as protocol parameters
 * (verified against the LIRC / IRremote public code tables). Each entry
 * becomes a ready-made remote the user can add with one tap.
 *
 * This is deliberately a starter set — any device not listed here can be
 * added as a custom remote using Pronto hex codes from public databases,
 * which the app transmits natively.
 */
object CodeDatabase {

    data class DeviceTemplate(
        val brand: String,
        val kind: String, // "TV", "Set-top box", ...
        val buttons: List<ButtonDef>,
    ) {
        val displayName get() = "$brand $kind"
    }

    val devices: List<DeviceTemplate> = listOf(

        // Samsung TVs — Samsung32 protocol, device 0x07 ("E0E0…" family)
        DeviceTemplate(
            "Samsung", "TV", listOf(
                ButtonDef("Power", Protocol.SAMSUNG, 0x07, 0x02),
                ButtonDef("Source", Protocol.SAMSUNG, 0x07, 0x01),
                ButtonDef("Vol +", Protocol.SAMSUNG, 0x07, 0x07),
                ButtonDef("Vol −", Protocol.SAMSUNG, 0x07, 0x0B),
                ButtonDef("Ch +", Protocol.SAMSUNG, 0x07, 0x12),
                ButtonDef("Ch −", Protocol.SAMSUNG, 0x07, 0x10),
                ButtonDef("Mute", Protocol.SAMSUNG, 0x07, 0x0F),
            )
        ),

        // LG TVs — NEC, device 0x04 ("20DF…" family)
        DeviceTemplate(
            "LG", "TV", listOf(
                ButtonDef("Power", Protocol.NEC, 0x04, 0x08),
                ButtonDef("Input", Protocol.NEC, 0x04, 0x0B),
                ButtonDef("Vol +", Protocol.NEC, 0x04, 0x02),
                ButtonDef("Vol −", Protocol.NEC, 0x04, 0x03),
                ButtonDef("Ch +", Protocol.NEC, 0x04, 0x00),
                ButtonDef("Ch −", Protocol.NEC, 0x04, 0x01),
                ButtonDef("Mute", Protocol.NEC, 0x04, 0x09),
            )
        ),

        // Sony TVs — SIRC-12, device 1
        DeviceTemplate(
            "Sony", "TV", listOf(
                ButtonDef("Power", Protocol.SONY12, 1, 21),
                ButtonDef("Vol +", Protocol.SONY12, 1, 18),
                ButtonDef("Vol −", Protocol.SONY12, 1, 19),
                ButtonDef("Ch +", Protocol.SONY12, 1, 16),
                ButtonDef("Ch −", Protocol.SONY12, 1, 17),
                ButtonDef("Mute", Protocol.SONY12, 1, 20),
            )
        ),

        // Philips TVs — RC5, address 0
        DeviceTemplate(
            "Philips", "TV", listOf(
                ButtonDef("Power", Protocol.RC5, 0, 12),
                ButtonDef("Vol +", Protocol.RC5, 0, 16),
                ButtonDef("Vol −", Protocol.RC5, 0, 17),
                ButtonDef("Ch +", Protocol.RC5, 0, 32),
                ButtonDef("Ch −", Protocol.RC5, 0, 33),
                ButtonDef("Mute", Protocol.RC5, 0, 13),
            )
        ),

        // Panasonic TVs — Kaseikyo 48-bit frames
        DeviceTemplate(
            "Panasonic", "TV", listOf(
                ButtonDef("Power", Protocol.PANASONIC, hexData = "40040100BCBD"),
                ButtonDef("Vol +", Protocol.PANASONIC, hexData = "400401000405"),
                ButtonDef("Vol −", Protocol.PANASONIC, hexData = "400401008485"),
                ButtonDef("Ch +", Protocol.PANASONIC, hexData = "400401002C2D"),
                ButtonDef("Ch −", Protocol.PANASONIC, hexData = "40040100ACAD"),
                ButtonDef("Mute", Protocol.PANASONIC, hexData = "400401004C4D"),
            )
        ),
    )

    /**
     * Power codes tried by the "universal search" screen: every power button
     * from the templates above plus extra widely-used power codes so the
     * sweep covers brands without a full template.
     */
    val powerSweep: List<Pair<String, ButtonDef>> =
        devices.mapNotNull { d ->
            d.buttons.firstOrNull { it.label == "Power" }?.let { d.displayName to it }
        } + listOf(
            "NEC generic TV (device 0)" to ButtonDef("Power", Protocol.NEC, 0x00, 0x0C),
            "Sharp/NEC TV (device 1)" to ButtonDef("Power", Protocol.NEC, 0x01, 0x0C),
            "Toshiba TV" to ButtonDef("Power", Protocol.NEC, 0x40, 0x12),
            "Sony (SIRC-15)" to ButtonDef("Power", Protocol.SONY15, 1, 21),
            "RC5 TV toggle" to ButtonDef("Power", Protocol.RC5, 0, 12),
        )
}
