"use client";

import { useEffect, useState } from "react";
import { Copy, History, LockKeyhole, RefreshCw, ShieldCheck, Sparkles, Trash2 } from "lucide-react";

import {
  CHARACTER_GROUPS,
  generatePassword,
  type CharacterGroup,
  type PasswordPolicy,
  validatePasswordPolicy,
} from "@/entities/password";
import {
  clearPasswordHistory,
  isHistoryEnabled,
  listPasswordHistory,
  savePasswordHistoryEntry,
  setHistoryEnabled,
  type PasswordHistoryEntry,
} from "@/shared/lib/passwordHistory";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const labels: Record<CharacterGroup, string> = { lowercase: "Lowercase", uppercase: "Uppercase", digits: "Digits", symbols: "Symbols" };

export function PasswordGeneratorScaffold() {
  const [length, setLength] = useState(16);
  const [groups, setGroups] = useState<CharacterGroup[]>(["lowercase", "uppercase", "digits"]);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [historyEnabled, setEnabled] = useState(false);
  const [history, setHistory] = useState<PasswordHistoryEntry[]>([]);

  useEffect(() => { void (async () => { setEnabled(await isHistoryEnabled()); setHistory(await listPasswordHistory()); })(); }, []);

  const policy: PasswordPolicy = { length, characterGroups: groups };
  const toggleGroup = (group: CharacterGroup) => setGroups((current) => current.includes(group) ? current.filter((item) => item !== group) : [...current, group]);

  async function generate() {
    const validation = validatePasswordPolicy(policy);
    if (!validation.valid) { setMessage(validation.message); return; }
    const nextPassword = generatePassword(policy);
    setPassword(nextPassword); setMessage("Password generated.");
    if (await savePasswordHistoryEntry({ id: crypto.randomUUID(), password: nextPassword, createdAt: new Date().toISOString(), policySummary: `${length} characters` })) setHistory(await listPasswordHistory());
  }

  async function toggleHistory() {
    if (!historyEnabled && !window.confirm("Password history stores plaintext passwords locally on this device. Enable it?")) return;
    await setHistoryEnabled(!historyEnabled); setEnabled(!historyEnabled); setMessage(!historyEnabled ? "History enabled." : "History disabled. Existing entries remain until cleared.");
  }

  async function copy() {
    try { await navigator.clipboard.writeText(password); setMessage("Password copied."); }
    catch { setMessage("Password could not be copied. Try again."); }
  }

  async function clear() { await clearPasswordHistory(); setHistory([]); setMessage("Password history cleared."); }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sky-100 via-background to-background px-4 py-10 sm:px-6 lg:py-16 dark:from-sky-950/40">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <header className="space-y-5 lg:pr-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Private by design
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">passGeneration</h1>
            <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg">Create strong, unique passwords in your browser. Nothing is sent anywhere.</p>
          </div>
          <div className="flex items-start gap-3 rounded-xl border bg-background/60 p-4 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <p>Generation uses Web Crypto. Password history is optional and remains only on this device.</p>
          </div>
        </header>

        <Card className="border-border/70 bg-card/95 shadow-xl shadow-slate-950/5 backdrop-blur dark:shadow-black/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Sparkles className="size-5 text-primary" aria-hidden="true" /> Generate a password</CardTitle>
            <CardDescription>Choose a length and the character groups you want to include.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-7">
            <section className="space-y-3" aria-labelledby="length-label">
              <div className="flex items-center justify-between gap-4">
                <Label id="length-label" htmlFor="password-length" className="text-sm font-medium">Password length</Label>
                <Input id="password-length" aria-label="Password length" className="w-20 text-center tabular-nums" type="number" min="4" max="128" value={length} onChange={(event) => setLength(Number(event.target.value))} />
              </div>
              <Slider aria-labelledby="length-label" value={[length]} min={4} max={128} step={1} onValueChange={(value) => setLength(typeof value === "number" ? value : (value[0] ?? 16))} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>4</span><span>128</span></div>
            </section>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Character groups</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {CHARACTER_GROUPS.map((group) => (
                  <Label key={group} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background px-3 py-3 text-sm font-normal transition-colors hover:bg-muted/60 has-[[data-checked]]:border-primary/50 has-[[data-checked]]:bg-primary/5">
                    <Checkbox checked={groups.includes(group)} onCheckedChange={() => toggleGroup(group)} />
                    {labels[group]}
                  </Label>
                ))}
              </div>
            </fieldset>

            {password && (
              <section className="space-y-2" aria-labelledby="generated-password-label">
                <Label id="generated-password-label" className="text-sm font-medium">Generated password</Label>
                <div className="flex gap-2 rounded-lg border bg-muted/40 p-2">
                  <output aria-label="Generated password" className="min-w-0 flex-1 overflow-x-auto px-2 py-1.5 font-mono text-sm tracking-wide">{password}</output>
                  <Button variant="outline" size="icon" onClick={copy} aria-label="Copy password"><Copy className="size-4" /></Button>
                </div>
              </section>
            )}

            <Button className="w-full" size="lg" onClick={generate}><RefreshCw className="size-4" aria-hidden="true" /> Generate password</Button>

            <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
              <Checkbox id="password-history" checked={historyEnabled} onCheckedChange={toggleHistory} className="mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor="password-history" className="cursor-pointer text-sm font-medium">Enable password history</Label>
                <p className="text-xs leading-5 text-muted-foreground">Stores plaintext passwords locally on this device. You can clear them at any time.</p>
              </div>
            </div>

            {message && <Alert><AlertDescription role="status">{message}</AlertDescription></Alert>}
          </CardContent>

          {history.length > 0 && (
            <CardFooter className="flex-col items-stretch gap-3">
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-sm font-medium"><History className="size-4" aria-hidden="true" /> Password history</h2>
                <Button variant="ghost" size="sm" onClick={clear}><Trash2 className="size-4" aria-hidden="true" /> Clear history</Button>
              </div>
              <ul className="max-h-32 space-y-1 overflow-y-auto rounded-md bg-background/60 p-2 font-mono text-xs">
                {history.map((entry) => <li key={entry.id} className="truncate px-1 py-1">{entry.password}</li>)}
              </ul>
            </CardFooter>
          )}
        </Card>
      </div>
    </main>
  );
}
