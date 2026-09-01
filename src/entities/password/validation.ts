import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "./constants";
import type { PasswordPolicy, PasswordPolicyValidation } from "./types";

export function validatePasswordPolicy(policy: PasswordPolicy): PasswordPolicyValidation {
  if (!Number.isInteger(policy.length) || policy.length < MIN_PASSWORD_LENGTH || policy.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, message: `Choose a length from ${MIN_PASSWORD_LENGTH} through ${MAX_PASSWORD_LENGTH}.` };
  }

  if (policy.characterGroups.length === 0) {
    return { valid: false, message: "Select at least one character group." };
  }

  if (new Set(policy.characterGroups).size !== policy.characterGroups.length) {
    return { valid: false, message: "Select each character group only once." };
  }

  if (policy.length < policy.characterGroups.length) {
    return { valid: false, message: "Choose a length that can include every selected character group." };
  }

  return { valid: true };
}
