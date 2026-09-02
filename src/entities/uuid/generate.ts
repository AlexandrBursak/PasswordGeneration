import type { UUIDVersion } from "./types";

function formatUUID(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateUUID(version: UUIDVersion, timestamp = Date.now()): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  if (version === "v7") {
    let timestampValue = BigInt(timestamp);

    for (let index = 5; index >= 0; index -= 1) {
      bytes[index] = Number(timestampValue & 0xffn);
      timestampValue >>= 8n;
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | (version === "v4" ? 0x40 : 0x70);
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatUUID(bytes);
}

export function generateUUIDs(version: UUIDVersion, count: number): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error("UUID count must be an integer between 1 and 100.");
  }

  return Array.from({ length: count }, () => generateUUID(version));
}
