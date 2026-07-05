# Universal IR Remote

An Android app that turns a phone with an **IR blaster** into a universal
remote control for TVs, set-top boxes, air conditioners, audio gear — anything
driven by an infrared remote.

## How it achieves "works with all remotes"

There are thousands of remote models, but almost all of them speak one of a
handful of IR protocols — and *every* remaining one can be expressed as a
Pronto hex code. The app therefore has three layers of coverage:

1. **Native protocol encoders** (`ir/ProtocolEncoder.kt`) for the protocols
   behind the vast majority of consumer remotes:
   - NEC and extended NEC (LG, Toshiba, Sharp, countless Chinese brands)
   - Samsung32 (Samsung TVs, the `E0E0…` family)
   - Sony SIRC 12/15/20-bit
   - Philips RC5 (Manchester coded)
   - Panasonic Kaseikyo 48-bit
   - Raw patterns (`FREQ:us,us,us,…`) for anything hand-captured

2. **Pronto hex support** (`ir/ProntoParser.kt`) — the universal interchange
   format used by every public IR code database (irdb, RemoteCentral, Global
   Caché, manufacturer docs). Paste a Pronto code for *any* device — including
   air conditioners with long stateful frames — and the app transmits it.

3. **A built-in starter database** (`data/CodeDatabase.kt`) with verified code
   sets for Samsung, LG, Sony, Philips and Panasonic TVs, plus a **"Find TV"
   universal power sweep** that steps through known power codes until your
   device reacts, then saves the matching code set.

## Features

- Add a remote from the built-in brand database with one tap
- "Find TV" power-code sweep for unknown brands
- Build fully custom remotes: any button, any protocol, or pasted Pronto hex
- Test a button before saving it
- Remotes persist on-device (JSON in SharedPreferences)
- Haptic tick on every transmit; carrier frequency is clamped to the ranges
  the phone's blaster actually supports
- Graceful degradation: on phones without an IR emitter the app still lets you
  build/edit remotes and explains why transmission is unavailable

## Requirements

- **Hardware:** an Android phone with an IR blaster (many Xiaomi/Redmi/Poco,
  Huawei/Honor, and some TCL models). Phones without one — including all
  iPhones — physically cannot transmit IR; no app can work around that.
- **Software:** Android 5.0+ (API 21). Uses the standard
  `android.hardware.ConsumerIrManager` API and the `TRANSMIT_IR` permission
  (granted automatically; it is a normal-level permission).

## Building

Open the `universal-ir-remote/` folder in Android Studio (Hedgehog or newer)
and press Run, or from the command line with an Android SDK installed:

```bash
cd universal-ir-remote
gradle assembleDebug   # or ./gradlew if you generate the wrapper
```

The APK lands in `app/build/outputs/apk/debug/`.

The IR engine (protocol encoders, Pronto parser, JSON models) is covered by
JVM unit tests — run them with `gradle test`.

## Project layout

```
app/src/main/java/com/fable/irremote/
├── model/Models.kt          # IrSignal, Protocol, ButtonDef, RemoteDef (+JSON)
├── ir/ProtocolEncoder.kt    # NEC / Samsung / Sony / RC5 / Panasonic / raw
├── ir/ProntoParser.kt       # Pronto hex → carrier + µs pattern
├── ir/IrTransmitter.kt      # ConsumerIrManager wrapper, carrier clamping
├── data/CodeDatabase.kt     # built-in brand code sets + power sweep list
├── data/RemoteStore.kt      # persistence for user remotes
└── ui/                      # Jetpack Compose screens
    ├── MainActivity.kt      # navigation + home screen
    └── Screens.kt           # remote pad, add-device, find-TV, custom editor
```

## Notes on air conditioners

AC remotes don't send "button" codes — they retransmit the *entire desired
state* (mode, temperature, fan, swing) in one long frame, and every vendor
encodes it differently. Full AC state modelling is out of scope for the
starter database, but AC codes captured as Pronto hex (widely available per
model online) transmit fine through the custom-remote path.
