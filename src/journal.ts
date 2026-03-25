import { saveEntries, loadEntries } from "./storage.js";

// Task 1: Data Typing and Modeling
// ENUM allows us to restrict the valid options heavily reducing typo bugs.
export enum Mood {
    HAPPY = "HAPPY",
    SAD = "SAD",
    MOTIVATED = "MOTIVATED",
    STRESSED = "STRESSED",
    CALM = "CALM"
}

// INTERFACE acts as a strict structural contract. If an object is missing 'id', TS throws an error.
export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    mood: Mood; // Restricts to only the exact valid Enum states
    timestamp: number;
}

// OPTIONAL CHALLENGE: Type Alias for a collection array.
export type Journal = JournalEntry[];

// State holding our current session notes
export let currentJournal: Journal = [];

// App Startup Initializer
export function initializeJournal(): void {
    currentJournal = loadEntries();
}

// Task 2: Generic and Type-Safe Functionality
/**
 * A highly reusable GENERIC function that safely finds an item in ANY array using a specific key/value.
 * Explaining to a Junior: "T" represents a generic shape. This function adapts to whatever shape 'list' is.
 * 'keyof T' guarantees that whatever 'key' you look for actually exists on the 'T' object type.
 */
export function findByProperty<T>(list: T[], key: keyof T, value: T[keyof T]): T | undefined {
    return list.find(item => item[key] === value);
}

// Type-Safe Mutations
// We take raw string parameters, map them into an object, and strongly type assert it as a `JournalEntry`.
// If we were missing the timestamp, TypeScript's compiler would scream an error blocking the build.
export function addEntry(title: string, content: string, moodString: string): JournalEntry {
    const newEntry: JournalEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        title: title,
        content: content,
        mood: moodString as Mood, // TYPE ASSERTION: Tells TS to explicitly treat this string as our Enum 
        timestamp: Date.now()
    };

    currentJournal.unshift(newEntry); // Add to the top of the array
    saveEntries(currentJournal);
    return newEntry;
}

export function deleteEntry(id: string): void {
    // Requirement 2: Demonstrate using the Generic Function to find an item first
    const entryToDelete = findByProperty<JournalEntry>(currentJournal, "id", id);
    
    if (entryToDelete) {
        currentJournal = currentJournal.filter(entry => entry.id !== id);
        saveEntries(currentJournal);
    }
}

export function getEntriesByMood(moodFilter: string | "ALL"): Journal {
    if (moodFilter === "ALL") return currentJournal;
    return currentJournal.filter(entry => entry.mood === moodFilter);
}
