"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

import { generateUUIDs, type UUIDVersion } from "@/entities/uuid";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UUIDGenerationMode = "single" | "batch";

export function UUIDGeneratorPanel() {
  const [version, setVersion] = useState<UUIDVersion>("v4");
  const [generationMode, setGenerationMode] = useState<UUIDGenerationMode>("single");
  const [count, setCount] = useState(10);
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function generate() {
    const requestedCount = generationMode === "single" ? 1 : count;

    try {
      setGeneratedUUIDs(generateUUIDs(version, requestedCount));
      setMessage(requestedCount === 1 ? "UUID generated." : `${requestedCount} UUIDs generated.`);
    } catch (error) {
      setGeneratedUUIDs([]);
      setMessage(error instanceof Error ? error.message : "UUIDs could not be generated.");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(generatedUUIDs.join("\n"));
      setMessage(generatedUUIDs.length === 1 ? "UUID copied." : "UUIDs copied.");
    } catch {
      setMessage("UUIDs could not be copied. Try again.");
    }
  }

  return (
    <>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">UUID version</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["v4", "v7"] as const).map((uuidVersion) => (
            <Label key={uuidVersion} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background px-3 py-3 text-sm font-normal has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="uuid-version"
                value={uuidVersion}
                checked={version === uuidVersion}
                onChange={() => setVersion(uuidVersion)}
                aria-label={`UUID ${uuidVersion}`}
              />
              UUID {uuidVersion}
            </Label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Generation mode</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["single", "batch"] as const).map((mode) => (
            <Label key={mode} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background px-3 py-3 text-sm font-normal has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="uuid-generation-mode"
                value={mode}
                checked={generationMode === mode}
                onChange={() => setGenerationMode(mode)}
                aria-label={mode === "single" ? "Single" : "Batch"}
              />
              {mode === "single" ? "Single" : "Batch"}
            </Label>
          ))}
        </div>
      </fieldset>

      {generationMode === "batch" && (
        <div className="space-y-2">
          <Label htmlFor="uuid-quantity">Quantity</Label>
          <Input
            id="uuid-quantity"
            aria-label="UUID quantity"
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
          <p className="text-xs text-muted-foreground">Generate between 1 and 100 UUIDs.</p>
        </div>
      )}

      {generatedUUIDs.length > 0 && (
        <section className="space-y-2" aria-labelledby="generated-uuids-label">
          <div className="flex items-center justify-between gap-3">
            <Label id="generated-uuids-label">Generated UUIDs</Label>
            <Button variant="outline" size="sm" onClick={copy}>
              <Copy className="size-4" aria-hidden="true" />
              {generatedUUIDs.length === 1 ? "Copy UUID" : "Copy UUIDs"}
            </Button>
          </div>
          <output aria-label="Generated UUIDs" className="block max-h-52 overflow-auto whitespace-pre rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-6">
            {generatedUUIDs.join("\n")}
          </output>
        </section>
      )}

      <Button className="w-full" size="lg" onClick={generate}>
        <RefreshCw className="size-4" aria-hidden="true" />
        {generationMode === "single" ? "Generate UUID" : "Generate UUIDs"}
      </Button>

      {message && <Alert><AlertDescription role="status">{message}</AlertDescription></Alert>}
    </>
  );
}
