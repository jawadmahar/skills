/*
 * Universal IR Remote — ESP32 / ESP8266 firmware
 *
 * Turns a ~£5 ESP32 (or ESP8266 / Wemos D1 mini) board with an IR LED into
 * a Wi-Fi universal remote. The board serves a mobile web app; any phone
 * (Android or iPhone) opens it in the browser and every button press is
 * transmitted as infrared by the board.
 *
 * Hardware:  IR LED (940 nm) or KY-005 module on IR_LED_PIN (default GPIO4;
 *            that's pin "D2" on a Wemos D1 mini). See esp32/README.md.
 *
 * Library:   "IRremoteESP8266" (install via Arduino IDE Library Manager).
 *            Despite the name it supports both ESP8266 and ESP32.
 *
 * Wi-Fi:     Fill in WIFI_SSID/WIFI_PASS below to join your network, then
 *            browse to http://ir-remote.local (or the IP shown in the
 *            Serial Monitor). If it can't connect (or you leave the SSID
 *            empty) it starts its own hotspot "IR-Remote" (password
 *            "irremote123") — connect to it and browse to http://192.168.4.1
 *
 * Saved remotes live in the *phone browser's* localStorage, so the firmware
 * stays stateless and multiple family members can keep their own layouts.
 */

#include <IRremoteESP8266.h>
#include <IRsend.h>

#if defined(ESP32)
  #include <WiFi.h>
  #include <WebServer.h>
  #include <ESPmDNS.h>
  WebServer server(80);
#else
  #include <ESP8266WiFi.h>
  #include <ESP8266WebServer.h>
  #include <ESP8266mDNS.h>
  ESP8266WebServer server(80);
#endif

// ------------------------------------------------------------ user config --

const char* WIFI_SSID = "";            // your Wi-Fi name ("" = hotspot only)
const char* WIFI_PASS = "";            // your Wi-Fi password
const char* AP_SSID   = "IR-Remote";   // fallback hotspot name
const char* AP_PASS   = "irremote123"; // fallback hotspot password (8+ chars)
const uint8_t IR_LED_PIN = 4;          // GPIO4 = "D2" on a Wemos D1 mini

// ---------------------------------------------------------------------------

IRsend irsend(IR_LED_PIN);

// Big enough for long learned codes (AC Pronto codes run ~200-500 words).
static uint16_t patternBuf[600];

// Parse a whitespace/comma separated list of numbers into patternBuf.
// Returns the count, or -1 on error / overflow.
static int parseNumberList(const String& text, int base) {
  int n = 0;
  const char* p = text.c_str();
  while (*p) {
    while (*p == ' ' || *p == ',' || *p == '\n' || *p == '\r' || *p == '\t') p++;
    if (!*p) break;
    char* end;
    unsigned long v = strtoul(p, &end, base);
    if (end == p) return -1;                       // not a number
    if (n >= (int)(sizeof(patternBuf) / sizeof(patternBuf[0]))) return -1;
    patternBuf[n++] = (uint16_t)v;
    p = end;
  }
  return n;
}

// Pronto hex: word0=0000(raw), word1=carrier divisor, word2/3=pair counts.
static bool sendProntoStr(const String& text, String& err) {
  int n = parseNumberList(text, 16);
  if (n < 6) { err = "Pronto code too short"; return false; }
  if (patternBuf[0] != 0) { err = "Only raw (0000) Pronto codes supported"; return false; }
  int expected = 4 + 2 * (patternBuf[2] + patternBuf[3]);
  if (n < expected) { err = "Pronto code truncated"; return false; }
  irsend.sendPronto(patternBuf, expected);
  return true;
}

// Raw: "38000:9000,4500,560,560,..."  (frequency Hz, then µs durations)
static bool sendRawStr(const String& text, String& err) {
  int colon = text.indexOf(':');
  if (colon < 0) { err = "Raw format is FREQ:us,us,..."; return false; }
  long freq = text.substring(0, colon).toInt();
  if (freq < 20000 || freq > 60000) { err = "Bad carrier frequency"; return false; }
  int n = parseNumberList(text.substring(colon + 1), 10);
  if (n < 2) { err = "Empty raw pattern"; return false; }
  irsend.sendRaw(patternBuf, n, freq / 1000);
  return true;
}

void handleSend() {
  String proto = server.arg("proto");
  uint32_t addr = strtoul(server.arg("addr").c_str(), nullptr, 0);
  uint32_t cmd  = strtoul(server.arg("cmd").c_str(),  nullptr, 0);
  uint32_t ext  = strtoul(server.arg("ext").c_str(),  nullptr, 0);
  String data = server.arg("data");

  bool ok = true;
  String err = "";
  static bool rc5Toggle = false;

  if (proto == "NEC") {
    // encodeNEC handles both standard (8-bit) and extended (16-bit) addresses.
    irsend.sendNEC(irsend.encodeNEC(addr, cmd));
  } else if (proto == "SAMSUNG") {
    irsend.sendSAMSUNG(irsend.encodeSAMSUNG(addr, cmd));
  } else if (proto == "SONY12") {
    irsend.sendSony(irsend.encodeSony(12, cmd, addr), 12, 2);
  } else if (proto == "SONY15") {
    irsend.sendSony(irsend.encodeSony(15, cmd, addr), 15, 2);
  } else if (proto == "SONY20") {
    irsend.sendSony(irsend.encodeSony(20, cmd, addr, ext), 20, 2);
  } else if (proto == "RC5") {
    rc5Toggle = !rc5Toggle;
    irsend.sendRC5(irsend.encodeRC5X(addr, cmd, rc5Toggle), kRC5XBits);
  } else if (proto == "PANASONIC") {
    uint64_t v = strtoull(data.c_str(), nullptr, 16);
    if (v == 0) { ok = false; err = "Bad Panasonic hex value"; }
    else irsend.sendPanasonic64(v);
  } else if (proto == "PRONTO") {
    ok = sendProntoStr(data, err);
  } else if (proto == "RAW") {
    ok = sendRawStr(data, err);
  } else {
    ok = false;
    err = "Unknown protocol '" + proto + "'";
  }

  server.send(ok ? 200 : 400, "text/plain", ok ? "OK" : err);
}

// --------------------------------------------------------------- web app --

static const char INDEX_HTML[] PROGMEM = R"HTML(<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Universal IR Remote</title>
<style>
 body{font-family:system-ui,sans-serif;background:#111;color:#eee;margin:0;padding:16px;max-width:520px;margin:0 auto}
 h1{font-size:1.25em;margin:8px 0 12px}
 h2{font-size:1.05em;margin:16px 0 8px}
 button{background:#2563eb;color:#fff;border:0;border-radius:10px;padding:13px 10px;font-size:1em;cursor:pointer}
 button.sec{background:#333}
 button.danger{background:#7f1d1d}
 .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
 .row{display:flex;gap:8px;margin:10px 0}
 .row button{flex:1}
 .card{background:#1d1d1f;border-radius:12px;padding:12px;margin:8px 0}
 .card .title{font-weight:600}
 input,select,textarea{width:100%;box-sizing:border-box;background:#222;color:#eee;border:1px solid #444;border-radius:8px;padding:10px;margin:4px 0;font-size:1em}
 .muted{color:#999;font-size:.85em}
 a{color:#7ab5ff}
 #toast{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:10px 16px;border-radius:8px;display:none;z-index:9}
</style></head><body>
<h1>Universal IR Remote</h1>
<div id="app"></div>
<div id="toast"></div>
<script>
"use strict";
// Built-in code sets (protocol parameters, LIRC/IRremote-verified).
const TEMPLATES=[
 {name:"Samsung TV",buttons:[
  {l:"Power",p:"SAMSUNG",a:7,c:2},{l:"Source",p:"SAMSUNG",a:7,c:1},{l:"Mute",p:"SAMSUNG",a:7,c:15},
  {l:"Vol +",p:"SAMSUNG",a:7,c:7},{l:"Vol -",p:"SAMSUNG",a:7,c:11},
  {l:"Ch +",p:"SAMSUNG",a:7,c:18},{l:"Ch -",p:"SAMSUNG",a:7,c:16}]},
 {name:"LG TV",buttons:[
  {l:"Power",p:"NEC",a:4,c:8},{l:"Input",p:"NEC",a:4,c:11},{l:"Mute",p:"NEC",a:4,c:9},
  {l:"Vol +",p:"NEC",a:4,c:2},{l:"Vol -",p:"NEC",a:4,c:3},
  {l:"Ch +",p:"NEC",a:4,c:0},{l:"Ch -",p:"NEC",a:4,c:1}]},
 {name:"Sony TV",buttons:[
  {l:"Power",p:"SONY12",a:1,c:21},{l:"Mute",p:"SONY12",a:1,c:20},
  {l:"Vol +",p:"SONY12",a:1,c:18},{l:"Vol -",p:"SONY12",a:1,c:19},
  {l:"Ch +",p:"SONY12",a:1,c:16},{l:"Ch -",p:"SONY12",a:1,c:17}]},
 {name:"Philips TV",buttons:[
  {l:"Power",p:"RC5",a:0,c:12},{l:"Mute",p:"RC5",a:0,c:13},
  {l:"Vol +",p:"RC5",a:0,c:16},{l:"Vol -",p:"RC5",a:0,c:17},
  {l:"Ch +",p:"RC5",a:0,c:32},{l:"Ch -",p:"RC5",a:0,c:33}]},
 {name:"Panasonic TV",buttons:[
  {l:"Power",p:"PANASONIC",d:"40040100BCBD"},{l:"Mute",p:"PANASONIC",d:"400401004C4D"},
  {l:"Vol +",p:"PANASONIC",d:"400401000405"},{l:"Vol -",p:"PANASONIC",d:"400401008485"},
  {l:"Ch +",p:"PANASONIC",d:"400401002C2D"},{l:"Ch -",p:"PANASONIC",d:"40040100ACAD"}]}
];
// Power sweep: every template power code plus extra common ones.
const SWEEP=TEMPLATES.map(t=>({n:t.name,b:t.buttons.find(x=>x.l=="Power")})).concat([
 {n:"NEC generic TV (device 0)",b:{l:"Power",p:"NEC",a:0,c:12}},
 {n:"Sharp/NEC TV (device 1)",b:{l:"Power",p:"NEC",a:1,c:12}},
 {n:"Toshiba TV",b:{l:"Power",p:"NEC",a:64,c:18}},
 {n:"Sony (SIRC-15)",b:{l:"Power",p:"SONY15",a:1,c:21}},
 {n:"RC5 TV toggle",b:{l:"Power",p:"RC5",a:0,c:12}}
]);
const PROTOS=["NEC","SAMSUNG","SONY12","SONY15","SONY20","RC5","PANASONIC","PRONTO","RAW"];
const usesAddr=p=>["NEC","SAMSUNG","SONY12","SONY15","SONY20","RC5"].includes(p);

let remotes=JSON.parse(localStorage.getItem("remotes")||"[]");
const persist=()=>localStorage.setItem("remotes",JSON.stringify(remotes));
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function toast(m){const t=$("toast");t.textContent=m;t.style.display="block";
 clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display="none",1800)}

async function send(b){
 const q=new URLSearchParams({proto:b.p});
 if(b.a!=null)q.set("addr",b.a); if(b.c!=null)q.set("cmd",b.c);
 if(b.e!=null)q.set("ext",b.e); if(b.d)q.set("data",b.d);
 try{
  const r=await fetch("/send",{method:"POST",body:q});
  toast(r.ok?"Sent "+b.l:await r.text());
 }catch(e){toast("Network error")}
}

// ------- views ------------------------------------------------------------
function home(){
 let h='<div class="row">'
  +'<button onclick="viewAdd()">Add device</button>'
  +'<button class="sec" onclick="viewEdit(-1)">Custom</button>'
  +'<button class="sec" onclick="viewSweep()">Find TV</button></div>';
 if(!remotes.length)
  h+='<p class="muted">No remotes yet. Add one from the built-in list, run '
   +'"Find TV" to sweep power codes, or build a custom remote from Pronto '
   +'hex codes (paste from any online IR database).</p>';
 remotes.forEach((r,i)=>{
  h+='<div class="card" onclick="viewRemote('+i+')"><span class="title">'+esc(r.name)
   +'</span><div class="muted">'+r.buttons.length+' buttons</div></div>';
 });
 $("app").innerHTML=h;
}
function viewRemote(i){
 const r=remotes[i];
 let h='<div class="row"><button class="sec" onclick="home()">&#8592; Back</button>'
  +'<button class="sec" onclick="viewEdit('+i+')">Edit</button>'
  +'<button class="danger" onclick="delRemote('+i+')">Delete</button></div>'
  +'<h2>'+esc(r.name)+'</h2><div class="grid">';
 r.buttons.forEach((b,j)=>{h+='<button onclick="send(remotes['+i+'].buttons['+j+'])">'+esc(b.l)+'</button>'});
 $("app").innerHTML=h+'</div>';
}
function delRemote(i){if(confirm("Delete "+remotes[i].name+"?")){remotes.splice(i,1);persist();home()}}
function viewAdd(){
 let h='<div class="row"><button class="sec" onclick="home()">&#8592; Back</button></div><h2>Add a device</h2>'
  +'<p class="muted">Built-in code sets. Brand missing? Use "Find TV" or a custom remote with Pronto codes.</p>';
 TEMPLATES.forEach((t,i)=>{
  h+='<div class="card" onclick="addTemplate('+i+')"><span class="title">'+esc(t.name)
   +'</span><div class="muted">'+t.buttons.map(b=>esc(b.l)).join(" &middot; ")+'</div></div>';
 });
 $("app").innerHTML=h;
}
function addTemplate(i){
 const t=TEMPLATES[i];
 remotes.push({name:t.name,buttons:t.buttons.map(b=>Object.assign({},b))});
 persist();toast(t.name+" added");home();
}
let sweepIdx=0;
function viewSweep(){
 const cur=SWEEP[sweepIdx%SWEEP.length];
 $("app").innerHTML='<div class="row"><button class="sec" onclick="home()">&#8592; Back</button></div>'
  +'<h2>Find your TV</h2><p class="muted">Point the IR LED at the device and tap '
  +'"Send power code". When it turns on or off, tap "It worked!".</p>'
  +'<p>Code '+(sweepIdx%SWEEP.length+1)+' of '+SWEEP.length+': <b>'+esc(cur.n)+'</b></p>'
  +'<div class="row"><button style="padding:20px" onclick="send(SWEEP['+(sweepIdx%SWEEP.length)+'].b)">Send power code</button></div>'
  +'<div class="row"><button class="sec" onclick="sweepIdx++;viewSweep()">Try next</button>'
  +'<button onclick="sweepSave()">It worked!</button></div>';
}
function sweepSave(){
 const cur=SWEEP[sweepIdx%SWEEP.length];
 remotes.push({name:cur.n,buttons:[Object.assign({},cur.b)]});
 persist();toast("Saved '"+cur.n+"' — add more buttons via Edit");home();
}
let draft=null,draftIdx=-1;
function viewEdit(i){
 draftIdx=i;
 draft=i>=0?JSON.parse(JSON.stringify(remotes[i])):{name:"",buttons:[]};
 renderEdit();
}
function renderEdit(){
 let h='<div class="row"><button class="sec" onclick="home()">&#8592; Back</button>'
  +'<button onclick="saveDraft()">Save remote</button></div>'
  +'<h2>'+(draftIdx>=0?"Edit remote":"New custom remote")+'</h2>'
  +'<input id="rname" placeholder="Remote name" value="'+esc(draft.name)+'">';
 draft.buttons.forEach((b,j)=>{
  h+='<div class="card"><span class="title">'+esc(b.l)+'</span> <span class="muted">'+esc(b.p)+'</span>'
   +'<div class="row"><button class="sec" onclick="send(draft.buttons['+j+'])">Test</button>'
   +'<button class="danger" onclick="draft.buttons.splice('+j+',1);renderEdit()">Remove</button></div></div>';
 });
 h+='<h2>Add button</h2><input id="bl" placeholder="Label (e.g. Power)">'
  +'<select id="bp" onchange="renderFields()">'+PROTOS.map(p=>'<option>'+p+'</option>').join("")+'</select>'
  +'<div id="bfields"></div><div class="row"><button onclick="addBtn()">Add button</button></div>';
 $("app").innerHTML=h;
 renderFields();
}
function renderFields(){
 const p=$("bp").value;
 $("bfields").innerHTML=usesAddr(p)
  ?'<input id="ba" placeholder="Address / device (e.g. 7 or 0x07)">'
   +'<input id="bc" placeholder="Command (e.g. 2 or 0x02)">'
   +(p=="SONY20"?'<input id="be" placeholder="Extended (0 if unsure)">':"")
  :'<textarea id="bd" rows="3" placeholder="'+(p=="PRONTO"?"Pronto hex: 0000 006D ...":p=="PANASONIC"?"48-bit hex, e.g. 40040100BCBD":"Raw: 38000:9000,4500,560,...")+'"></textarea>';
}
function addBtn(){
 const l=$("bl").value.trim(),p=$("bp").value;
 if(!l){toast("Label is required");return}
 const b={l:l,p:p};
 if(usesAddr(p)){
  b.a=parseInt($("ba").value,$("ba").value.trim().startsWith("0x")?16:10);
  b.c=parseInt($("bc").value,$("bc").value.trim().startsWith("0x")?16:10);
  if(isNaN(b.a)||isNaN(b.c)){toast("Address and command must be numbers");return}
  if(p=="SONY20")b.e=parseInt($("be").value||"0");
 }else{
  b.d=$("bd").value.trim();
  if(!b.d){toast("Code is required");return}
 }
 draft.buttons.push(b);$("bl").value="";renderEdit();toast("Button added — tap Test to try it");
}
function saveDraft(){
 draft.name=$("rname").value.trim();
 if(!draft.name){toast("Name the remote first");return}
 if(!draft.buttons.length){toast("Add at least one button");return}
 if(draftIdx>=0)remotes[draftIdx]=draft;else remotes.push(draft);
 persist();home();toast("Saved");
}
home();
</script></body></html>
)HTML";

void handleRoot() {
  server.send_P(200, "text/html", INDEX_HTML);
}

// ------------------------------------------------------------------ boot --

void setup() {
  Serial.begin(115200);
  irsend.begin();

  bool joined = false;
  if (strlen(WIFI_SSID) > 0) {
    Serial.printf("\nConnecting to %s", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) {
      delay(500);
      Serial.print(".");
    }
    joined = WiFi.status() == WL_CONNECTED;
  }

  if (joined) {
    Serial.printf("\nConnected. Open http://%s/ or http://ir-remote.local/\n",
                  WiFi.localIP().toString().c_str());
  } else {
    WiFi.mode(WIFI_AP);
    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("\nHotspot '%s' started (password '%s').\n", AP_SSID, AP_PASS);
    Serial.println("Connect to it and open http://192.168.4.1/");
  }

  if (MDNS.begin("ir-remote")) MDNS.addService("http", "tcp", 80);

  server.on("/", handleRoot);
  server.on("/send", handleSend);
  server.begin();
}

void loop() {
  server.handleClient();
#if !defined(ESP32)
  MDNS.update();
#endif
}
