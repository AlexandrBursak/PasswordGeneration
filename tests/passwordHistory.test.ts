import {
  clearPasswordHistory,
  isHistoryEnabled,
  listPasswordHistory,
  savePasswordHistoryEntry,
  setHistoryEnabled,
} from "@/shared/lib/passwordHistory";

describe("password history", () => {
  beforeEach(async () => {
    await clearPasswordHistory();
    await setHistoryEnabled(false);
  });

  it("does not store an entry until history is explicitly enabled", async () => {
    const saved = await savePasswordHistoryEntry({
      id: "entry-1",
      password: "correct-horse-battery-staple",
      createdAt: "2026-09-01T00:00:00.000Z",
      policySummary: "lowercase",
    });

    expect(saved).toBe(false);
    await expect(listPasswordHistory()).resolves.toEqual([]);
  });

  it("stores, lists, disables, and clears opted-in history", async () => {
    await setHistoryEnabled(true);
    await savePasswordHistoryEntry({
      id: "older",
      password: "first-password",
      createdAt: "2026-09-01T00:00:00.000Z",
      policySummary: "lowercase",
    });
    await savePasswordHistoryEntry({
      id: "newer",
      password: "second-password",
      createdAt: "2026-09-02T00:00:00.000Z",
      policySummary: "uppercase",
    });

    await expect(isHistoryEnabled()).resolves.toBe(true);
    await expect(listPasswordHistory()).resolves.toMatchObject([{ id: "newer" }, { id: "older" }]);

    await setHistoryEnabled(false);
    await expect(savePasswordHistoryEntry({
      id: "blocked",
      password: "third-password",
      createdAt: "2026-09-03T00:00:00.000Z",
      policySummary: "digits",
    })).resolves.toBe(false);

    await clearPasswordHistory();
    await expect(listPasswordHistory()).resolves.toEqual([]);
  });
});
