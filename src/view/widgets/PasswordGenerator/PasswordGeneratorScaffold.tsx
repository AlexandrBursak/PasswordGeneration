"use client";

import { useEffect, useState } from "react";

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

import styles from "./PasswordGeneratorScaffold.module.css";

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

  return <main className={styles.main}><h1>passGeneration</h1><label>Length <input aria-label="Password length" type="number" min="4" max="128" value={length} onChange={(event) => setLength(Number(event.target.value))} /></label><fieldset><legend>Character groups</legend>{CHARACTER_GROUPS.map((group) => <label key={group}><input type="checkbox" checked={groups.includes(group)} onChange={() => toggleGroup(group)} /> {labels[group]}</label>)}</fieldset><button onClick={generate}>Generate password</button>{password && <><output aria-label="Generated password">{password}</output><button onClick={copy}>Copy password</button></>}<label><input type="checkbox" checked={historyEnabled} onChange={toggleHistory} /> Enable password history</label>{history.length > 0 && <section><h2>Password history</h2><ul>{history.map((entry) => <li key={entry.id}>{entry.password}</li>)}</ul><button onClick={clear}>Clear history</button></section>}<p role="status">{message}</p></main>;
}
