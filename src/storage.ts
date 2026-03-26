import { JournalEntry } from "./journal.js";

const STORAGE_KEY = "mood_journal_entries";


export function loadEntries(): JournalEntry[] {
    const rawData = localStorage.getItem(STORAGE_KEY);
    
  
    if (rawData === null) {

        return [] as JournalEntry[];
    }

    try {

        const parsedData = JSON.parse(rawData) as JournalEntry[];
        return parsedData;
    } catch (error) {
        console.error("Failed to parse local storage records.", error);
        return [] as JournalEntry[];
    }
}


export function saveEntries(entries: JournalEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
