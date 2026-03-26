import { saveEntries, loadEntries } from "./storage.js";
export var Mood;
(function (Mood) {
    Mood["HAPPY"] = "HAPPY";
    Mood["SAD"] = "SAD";
    Mood["MOTIVATED"] = "MOTIVATED";
    Mood["STRESSED"] = "STRESSED";
    Mood["CALM"] = "CALM";
})(Mood || (Mood = {}));
export let currentJournal = [];
export function initializeJournal() {
    currentJournal = loadEntries();
}
/**
 * Generic utility to find an item by a property within any typed array.
 */
export function findByProperty(list, key, value) {
    return list.find(item => item[key] === value);
}
/**
 * Validates and casts a raw string value into the Mood enum safely.
 */
function parseMood(moodString) {
    if (Object.values(Mood).includes(moodString)) {
        return moodString;
    }
    throw new Error(`Invalid mood value: "${moodString}"`);
}
/**
 * Creates a new JournalEntry with all required fields enforced by the interface.
 */
export function addEntry(title, content, moodString) {
    const newEntry = {
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
export function updateEntry(id, title, content, moodString) {
    const index = currentJournal.findIndex(entry => entry.id === id);
    if (index === -1)
        return undefined;
    const updatedEntry = {
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
export function deleteEntry(id) {
    const entryToDelete = findByProperty(currentJournal, "id", id);
    if (entryToDelete) {
        currentJournal = currentJournal.filter(entry => entry.id !== id);
        saveEntries(currentJournal);
    }
}
/**
 * Filters entries by mood. Returns all if "ALL" is passed.
 */
export function getEntriesByMood(moodFilter) {
    if (moodFilter === "ALL")
        return currentJournal;
    return currentJournal.filter(entry => entry.mood === moodFilter);
}
/**
 * Searches entries by matching title or content against a query string (case-insensitive).
 */
export function searchEntries(query) {
    const q = query.toLowerCase().trim();
    if (!q)
        return currentJournal;
    return currentJournal.filter(entry => entry.title.toLowerCase().includes(q) ||
        entry.content.toLowerCase().includes(q));
}
