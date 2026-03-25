import { JournalEntry } from "./journal.js";

const STORAGE_KEY = "mood_journal_entries";

// Task 2: Type Assertion for Storage
// Reaching into localStorage always returns strings (or null if it doesn't exist).
export function loadEntries(): JournalEntry[] {
    const rawData = localStorage.getItem(STORAGE_KEY);
    
    // 1. Handling the `null` case gracefully and type-safely.
    if (rawData === null) {
        // Return an empty array but cast it as JournalEntry[] to satisfy the strict TS return type.
        return [] as JournalEntry[];
    }

    try {
        // 2. Type Assertion logic:
        // JSON.parse returns the heavily unsafe 'any' type in TS.
        // We MUST use `as JournalEntry[]` so the compiler knows exactly what shape to expect moving forward!
        const parsedData = JSON.parse(rawData) as JournalEntry[];
        return parsedData;
    } catch (error) {
        console.error("Failed to parse local storage records.", error);
        return [] as JournalEntry[];
    }
}

// Function requires the exact type constraint 'JournalEntry[]'
export function saveEntries(entries: JournalEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
