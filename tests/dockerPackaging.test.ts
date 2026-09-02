import { readFileSync } from "node:fs";

describe("production build resource controls", () => {
  it("persists pnpm and Next build caches between Docker builds", () => {
    const dockerfile = readFileSync("docker/Dockerfile", "utf8");

    expect(dockerfile).toContain("--mount=type=cache,id=passgeneration-pnpm");
    expect(dockerfile).toContain("--mount=type=cache,id=passgeneration-next,target=/app/.next/cache");
  });

  it("enables the low-memory Webpack optimization", () => {
    const nextConfig = readFileSync("next.config.ts", "utf8");

    expect(nextConfig).toContain("webpackMemoryOptimizations: true");
  });
});
