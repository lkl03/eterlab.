#!/usr/bin/env node
/**
 * Admin panel setup helper. Works on .env.local (gitignored).
 *
 *   node scripts/admin-setup.mjs          generate ADMIN_SESSION_SECRET + ADMIN_TOTP_SECRET
 *                                         if missing, print the Google Authenticator URI
 *   node scripts/admin-setup.mjs --pin    ask for the PIN (hidden) and store ADMIN_PIN_HASH
 *
 * Changing ADMIN_SESSION_SECRET invalidates the PIN hash and every session,
 * so the script never overwrites an existing one.
 */

import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

const ENV_PATH = resolve(process.cwd(), ".env.local");

function readEnv() {
  const env = new Map();
  if (!existsSync(ENV_PATH)) return env;
  for (const line of readFileSync(ENV_PATH, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env.set(m[1], m[2].replace(/^"(.*)"$/, "$1"));
  }
  return env;
}

function writeEnv(updates) {
  let text = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
  for (const [key, value] of Object.entries(updates)) {
    const line = `${key}=${value}`;
    const re = new RegExp(`^${key}=.*$`, "m");
    text = re.test(text) ? text.replace(re, line) : `${text}${text && !text.endsWith("\n") ? "\n" : ""}${line}\n`;
  }
  writeFileSync(ENV_PATH, text);
}

function base32(buf) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += alphabet[(value << (5 - bits)) & 31];
  return out;
}

// readline with the echo muted. Raw-mode stdin drops or batches keystrokes in
// some Windows terminals (the PIN prompt never finished there).
function askHidden(question) {
  return new Promise((done) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    rl._writeToOutput = (s) => {
      if (!muted || s.includes(question)) process.stdout.write(s);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      done(answer.trim());
    });
    muted = true;
  });
}

const env = readEnv();

if (process.argv.includes("--pin")) {
  const secret = env.get("ADMIN_SESSION_SECRET");
  if (!secret) {
    console.error("Falta ADMIN_SESSION_SECRET en .env.local. Corré primero: node scripts/admin-setup.mjs");
    process.exit(1);
  }
  const pin = await askHidden("PIN (solo números, 4 a 12 dígitos): ");
  if (!/^\d{4,12}$/.test(pin)) {
    console.error("El PIN tiene que ser numérico, de 4 a 12 dígitos.");
    process.exit(1);
  }
  const again = await askHidden("Repetí el PIN: ");
  if (again !== pin) {
    console.error("Los PIN no coinciden.");
    process.exit(1);
  }
  writeEnv({ ADMIN_PIN_HASH: scryptSync(pin, secret, 32).toString("hex") });
  console.log("ADMIN_PIN_HASH guardado en .env.local. Cargalo también en Vercel (Production).");
} else {
  const updates = {};
  if (!env.get("ADMIN_SESSION_SECRET")) updates.ADMIN_SESSION_SECRET = randomBytes(32).toString("hex");
  if (!env.get("ADMIN_TOTP_SECRET")) updates.ADMIN_TOTP_SECRET = base32(randomBytes(20));
  if (!env.get("ADMIN_ALLOWED_EMAILS")) updates.ADMIN_ALLOWED_EMAILS = "contact.eterlab@gmail.com,lulago17@gmail.com";
  writeEnv(updates);

  const totp = updates.ADMIN_TOTP_SECRET ?? env.get("ADMIN_TOTP_SECRET");
  const label = encodeURIComponent("eterlab. admin");
  console.log(Object.keys(updates).length ? `Generado: ${Object.keys(updates).join(", ")}` : "Los secretos ya existían; no se cambió nada.");
  console.log("\nGoogle Authenticator → Agregar código → Ingresar clave de configuración, o un QR de esta URI:");
  console.log(`otpauth://totp/${label}?secret=${totp}&issuer=eterlab.&algorithm=SHA1&digits=6&period=30`);
  console.log("\nSiguiente: node scripts/admin-setup.mjs --pin");
}
