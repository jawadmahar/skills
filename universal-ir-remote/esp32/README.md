# Universal IR Remote — £5–£10 hardware version (ESP32 / ESP8266)

This folder turns a cheap Wi-Fi microcontroller board into the IR blaster.
The board serves the remote as a **web app**, so it works from *any* phone's
browser — Android or iPhone — with nothing to install on the phone.

## Shopping list (Amazon / eBay UK)

Pick **one** board:

| Item | Typical price | Search term |
|---|---|---|
| ESP32 dev board (recommended) | £4–7 | "ESP32 development board WROOM-32" |
| — or — Wemos D1 mini (ESP8266) | £3–5 | "Wemos D1 mini ESP8266" |

Plus the IR transmitter (pick one):

| Item | Typical price | Search term |
|---|---|---|
| KY-005 IR transmitter module (easiest, no soldering) | £1–3 | "KY-005 infrared transmitter module" |
| — or — bare 940 nm IR LEDs (pack) + 220 Ω resistor | £1–2 | "940nm IR LED 5mm" |

And, if you don't have them already:

| Item | Typical price |
|---|---|
| Female-female Dupont jumper wires | £2 |
| Micro-USB (or USB-C, check your board) data cable + any 5 V USB charger | often already owned |

**Total: roughly £6–£10.**

## Wiring

Only two or three wires. Default signal pin is **GPIO4** (labelled **D2** on
a Wemos D1 mini) — change `IR_LED_PIN` in the sketch if you use another pin.

**KY-005 module (no soldering — just jumper wires):**

```
KY-005 "S"  (signal)  ->  GPIO4  (D2 on D1 mini)
KY-005 "-"  (ground)  ->  GND
(middle pin: leave unconnected)
```

**Bare IR LED:**

```
GPIO4 ──[220 Ω resistor]──▶|── GND        (▶| = IR LED, long leg toward resistor)
```

Direct drive like this gives ~1–3 m of range, plenty for a coffee table.
For across-the-room range, drive the LED through a cheap NPN transistor
(2N2222/S8050): GPIO4 → 1 kΩ → base; LED + 100 Ω from 5 V to collector;
emitter to GND.

## Flashing (one-time, ~15 minutes)

1. Install the free [Arduino IDE](https://www.arduino.cc/en/software).
2. **File → Preferences → Additional boards manager URLs**, paste:
   - ESP32: `https://espressif.github.io/arduino-esp32/package_esp32_index.json`
   - ESP8266: `https://arduino.esp8266.com/stable/package_esp8266com_index.json`
3. **Tools → Board → Boards Manager**: install "esp32" (or "esp8266").
4. **Tools → Manage Libraries**: install **IRremoteESP8266**
   (works on both chips despite the name).
5. Open `UniversalIrRemote/UniversalIrRemote.ino`, fill in your Wi-Fi name
   and password in the two lines at the top (or leave empty to use hotspot
   mode).
6. Select your board (**ESP32 Dev Module** or **LOLIN(WEMOS) D1 R2 & mini**)
   and its USB port, press **Upload**.

## Using it

- On your Wi-Fi: open **http://ir-remote.local** (or the IP address printed
  in the Arduino Serial Monitor at 115200 baud).
- No Wi-Fi configured / connection failed: the board starts its own hotspot
  **IR-Remote** (password `irremote123`). Join it on your phone and open
  **http://192.168.4.1**.

The web app mirrors the Android app: built-in Samsung / LG / Sony / Philips /
Panasonic TV remotes, a **"Find TV"** power-code sweep for unknown brands, and
custom remotes built from protocol parameters or **Pronto hex** codes pasted
from any online IR code database. Saved remotes are stored in the phone
browser's local storage, so each person keeps their own layouts.

## Troubleshooting

- **Nothing happens**: phone cameras can *see* IR — point your phone's
  selfie camera at the LED while pressing a button; you should see it flash
  purple. No flash → wiring/pin problem. Flash but no reaction → wrong code
  set; try "Find TV" or a Pronto code for your exact model.
- **Weak range**: use the transistor driver above, or a KY-005 pointed
  directly at the device.
- **`ir-remote.local` doesn't resolve** (some Android versions): use the IP
  address from the Serial Monitor instead.
