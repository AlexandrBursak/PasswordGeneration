export type CharacterGroup = "lowercase" | "uppercase" | "digits" | "symbols";

export interface PasswordPolicy {
  length: number;
  characterGroups: CharacterGroup[];
}

export type PasswordPolicyValidation = { valid: true } | { valid: false; message: string };
