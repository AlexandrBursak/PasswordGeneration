import { CHARACTER_SETS } from "./constants";
import type { CharacterGroup, PasswordPolicy } from "./types";
import { validatePasswordPolicy } from "./validation";

function randomIndex(size: number): number {
  const limit = Math.floor(256 / size) * size;
  const value = new Uint8Array(1);

  do {
    crypto.getRandomValues(value);
  } while (value[0] >= limit);

  return value[0] % size;
}

function pickCharacter(characters: string): string {
  return characters[randomIndex(characters.length)];
}

function shuffle(characters: string[]): string[] {
  for (let index = characters.length - 1; index > 0; index -= 1) {
    const replacement = randomIndex(index + 1);
    [characters[index], characters[replacement]] = [characters[replacement], characters[index]];
  }
  return characters;
}

export function generatePassword(policy: PasswordPolicy): string {
  const validation = validatePasswordPolicy(policy);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const selectedSets = policy.characterGroups.map((group: CharacterGroup) => CHARACTER_SETS[group]);
  const alphabet = selectedSets.join("");
  const password = selectedSets.map(pickCharacter);

  while (password.length < policy.length) {
    password.push(pickCharacter(alphabet));
  }

  return shuffle(password).join("");
}
