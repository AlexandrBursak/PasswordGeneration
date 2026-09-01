import type { CharacterGroup } from "./types";

export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 128;

export const CHARACTER_GROUPS: readonly CharacterGroup[] = [
  "lowercase",
  "uppercase",
  "digits",
  "symbols",
];

export const CHARACTER_SETS: Record<CharacterGroup, string> = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*",
};
