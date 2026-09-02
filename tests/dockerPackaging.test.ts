import { readFileSync } from "node:fs";

describe("production build resource controls", () => {
  it("persists pnpm and Next build caches between Docker builds", () => {
    const dockerfile = readFileSync("docker/Dockerfile", "utf8");

    expect(dockerfile).toContain("--mount=type=cache,id=passgeneration-pnpm");
    expect(dockerfile).toContain("--mount=type=cache,id=passgeneration-next,target=/app/.next/cache");
  });

  it("does not re-verify the repository's trusted frozen lockfile", () => {
    const dockerfile = readFileSync("docker/Dockerfile", "utf8");

    expect(dockerfile).toContain("pnpm install --frozen-lockfile --trust-lockfile");
  });

  it("caps Node memory and serializes Next build workers", () => {
    const dockerfile = readFileSync("docker/Dockerfile", "utf8");
    const nextConfig = readFileSync("next.config.ts", "utf8");

    expect(dockerfile).toContain("NODE_OPTIONS=--max-old-space-size=192 pnpm install");
    expect(dockerfile).toContain("NODE_OPTIONS=--max-old-space-size=256 CI=true pnpm build");
    expect(nextConfig).toContain("cpus: 1");
  });

  it("leaves type checking to the required CI typecheck gate", () => {
    const nextConfig = readFileSync("next.config.ts", "utf8");

    expect(nextConfig).toContain("ignoreBuildErrors: true");
  });

  it("enables the low-memory Webpack optimization", () => {
    const nextConfig = readFileSync("next.config.ts", "utf8");

    expect(nextConfig).toContain("webpackMemoryOptimizations: true");
  });
});
