import { generateUUID, generateUUIDs } from "@/entities/uuid";

describe("generateUUID", () => {
  it("generates an RFC 9562 UUIDv4 with the variant bits set", () => {
    const uuid = generateUUID("v4");

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("generates an RFC 9562 UUIDv7 containing the Unix millisecond timestamp", () => {
    const timestamp = 1_740_000_000_123;
    const uuid = generateUUID("v7", timestamp);
    const encodedTimestamp = uuid.slice(0, 13).replace("-", "");

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(Number.parseInt(encodedTimestamp, 16)).toBe(timestamp);
  });
});

describe("generateUUIDs", () => {
  it("generates the requested number of unique UUIDs", () => {
    const uuids = generateUUIDs("v4", 10);

    expect(uuids).toHaveLength(10);
    expect(new Set(uuids)).toHaveLength(10);
  });

  it.each([0, 101, 1.5])("rejects an invalid batch size of %s", (count) => {
    expect(() => generateUUIDs("v7", count)).toThrow("UUID count must be an integer between 1 and 100.");
  });
});
