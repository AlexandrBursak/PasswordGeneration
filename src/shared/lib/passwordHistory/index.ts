import "fake-indexeddb/auto";

export interface PasswordHistoryEntry {
  id: string;
  password: string;
  createdAt: string;
  policySummary: string;
}

const DATABASE_NAME = "pass-generation";
const DATABASE_VERSION = 1;
const HISTORY_STORE = "password-history";
const SETTINGS_STORE = "settings";
const HISTORY_ENABLED_KEY = "history-enabled";

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

export function openPasswordHistoryDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.addEventListener("upgradeneeded", () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(HISTORY_STORE)) {
        database.createObjectStore(HISTORY_STORE, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(SETTINGS_STORE)) {
        database.createObjectStore(SETTINGS_STORE);
      }
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

export async function isHistoryEnabled(): Promise<boolean> {
  const database = await openPasswordHistoryDatabase();
  const transaction = database.transaction(SETTINGS_STORE, "readonly");
  const enabled = await requestResult(transaction.objectStore(SETTINGS_STORE).get(HISTORY_ENABLED_KEY));
  database.close();
  return enabled === true;
}

export async function setHistoryEnabled(enabled: boolean): Promise<void> {
  const database = await openPasswordHistoryDatabase();
  const transaction = database.transaction(SETTINGS_STORE, "readwrite");
  await requestResult(transaction.objectStore(SETTINGS_STORE).put(enabled, HISTORY_ENABLED_KEY));
  database.close();
}

export async function savePasswordHistoryEntry(entry: PasswordHistoryEntry): Promise<boolean> {
  if (!(await isHistoryEnabled())) {
    return false;
  }

  const database = await openPasswordHistoryDatabase();
  const transaction = database.transaction(HISTORY_STORE, "readwrite");
  await requestResult(transaction.objectStore(HISTORY_STORE).put(entry));
  database.close();
  return true;
}

export async function listPasswordHistory(): Promise<PasswordHistoryEntry[]> {
  const database = await openPasswordHistoryDatabase();
  const transaction = database.transaction(HISTORY_STORE, "readonly");
  const entries = await requestResult(transaction.objectStore(HISTORY_STORE).getAll());
  database.close();
  return entries.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function clearPasswordHistory(): Promise<void> {
  const database = await openPasswordHistoryDatabase();
  const transaction = database.transaction(HISTORY_STORE, "readwrite");
  await requestResult(transaction.objectStore(HISTORY_STORE).clear());
  database.close();
}
