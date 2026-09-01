import {
  CHARACTER_GROUPS,
  generatePassword,
  validatePasswordPolicy,
  type PasswordPolicy,
} from "@/entities/password";

describe("password policy and generation", () => {
  const policy: PasswordPolicy = {
    length: 12,
    characterGroups: ["lowercase", "uppercase", "digits", "symbols"],
  };

  it("accepts a valid policy and creates only selected groups", () => {
    expect(validatePasswordPolicy(policy)).toEqual({ valid: true });

    const password = generatePassword(policy);

    expect(password).toHaveLength(12);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*]/);
  });

  it.each<PasswordPolicy>([
    { length: 3, characterGroups: ["lowercase"] },
    { length: 129, characterGroups: ["lowercase"] },
    { length: 12, characterGroups: [] },
    { length: 2, characterGroups: ["lowercase", "uppercase", "digits"] },
  ])("rejects an invalid policy %#", (invalidPolicy) => {
    expect(validatePasswordPolicy(invalidPolicy).valid).toBe(false);
  });

  it("does not include unselected character groups", () => {
    const digitsOnly = generatePassword({ length: 8, characterGroups: ["digits"] });

    expect(digitsOnly).toMatch(/^\d{8}$/);
  });

  it("exposes every supported group", () => {
    expect(CHARACTER_GROUPS).toHaveLength(4);
  });
});
