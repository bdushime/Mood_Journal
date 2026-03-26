import { saveEntries, loadEntries } from "./storage.js";

export enum Mood {
    HAPPY = "HAPPY",
    SAD = "SAD",
    MOTIVATED = "MOTIVATED",
    STRESSED = "STRESSED",
    CALM = "CALM"
}

export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    mood: Mood;
    timestamp: number;
}

export type Journal = JournalEntry[];

export let currentJournal: Journal = [];

export function initializeJournal(): void {
    currentJournal = loadEntries();
}

/**
 * Generic utility to find an item by a property within any typed array.
 */
export function findByProperty<T>(list: T[], key: keyof T, value: T[keyof T]): T | undefined {
    return list.find(item => item[key] === value);
}

/**
 * Validates and casts a raw string value into the Mood enum safely.
 */
function parseMood(moodString: string): Mood {
    if (Object.values(Mood).includes(moodString as Mood)) {
        return moodString as Mood;
    }
    throw new Error(`Invalid mood value: "${moodString}"`);
}

/**
 * Creates a new JournalEntry with all required fields enforced by the interface.
 */
export function addEntry(title: string, content: string, moodString: string): JournalEntry {
    const newEntry: JournalEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        title: title,
        content: content,
        mood: parseMood(moodString),
        timestamp: Date.now()
    };

    currentJournal.unshift(newEntry);
    saveEntries(currentJournal);
    return newEntry;
}

/**
 * Updates an existing entry's fields by ID. Returns the updated entry or undefined if not found.
 */
export function updateEntry(id: string, title: string, content: string, moodString: string): JournalEntry | undefined {
    const index = currentJournal.findIndex(entry => entry.id === id);
    if (index === -1) return undefined;

    const updatedEntry: JournalEntry = {
        ...currentJournal[index],
        title: title,
        content: content,
        mood: parseMood(moodString),
    };

    currentJournal[index] = updatedEntry;
    saveEntries(currentJournal);
    return updatedEntry;
}

/**
 * Removes an entry by ID using the generic findByProperty utility.
 */
export function deleteEntry(id: string): void {
    const entryToDelete = findByProperty<JournalEntry>(currentJournal, "id", id);
    if (entryToDelete) {
        currentJournal = currentJournal.filter(entry => entry.id !== id);
        saveEntries(currentJournal);
    }
}

/**
 * Filters entries by mood. Returns all if "ALL" is passed.
 */
export function getEntriesByMood(moodFilter: string | "ALL"): Journal {
    if (moodFilter === "ALL") return currentJournal;
    return currentJournal.filter(entry => entry.mood === moodFilter);
}

/**
 * Searches entries by matching title or content against a query string (case-insensitive).
 */
export function searchEntries(query: string): Journal {
    const q = query.toLowerCase().trim();
    if (!q) return currentJournal;
    return currentJournal.filter(
        entry =>
            entry.title.toLowerCase().includes(q) ||
            entry.content.toLowerCase().includes(q)
    );
}
