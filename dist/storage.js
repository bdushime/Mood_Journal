const STORAGE_KEY = "mood_journal_entries";
export function loadEntries() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData === null) {
        return [];
    }
    try {
        const parsedData = JSON.parse(rawData);
        return parsedData;
    }
    catch (error) {
        console.error("Failed to parse local storage records.", error);
        return [];
    }
}
export function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
