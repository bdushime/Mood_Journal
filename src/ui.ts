import { addEntry, deleteEntry, getEntriesByMood, initializeJournal, currentJournal, JournalEntry } from "./journal.js";

// Task 3: DOM Manipulation 
// When selecting DOM elements, TS views them ambiguously as standard 'HTMLElement' or 'null'.
// Using explicitly casted types (as HTMLFormElement) unlocks specific properties like .value or .reset() for the compiler.
const form = document.getElementById("journal-form") as HTMLFormElement;
const titleInput = document.getElementById("entry-title") as HTMLInputElement;
const contentInput = document.getElementById("entry-content") as HTMLTextAreaElement;
const moodSelect = document.getElementById("entry-mood") as HTMLSelectElement;
const filterSelect = document.getElementById("filter-mood") as HTMLSelectElement;
const entriesList = document.getElementById("entries-list") as HTMLDivElement;

// Application Bootup Event
document.addEventListener("DOMContentLoaded", () => {
    initializeJournal();
    // Pass strictly typed array
    renderEntries(currentJournal);
});

// Using explicitly typed standard 'Event' parameter
form.addEventListener("submit", (e: Event) => {
    e.preventDefault();

    const title: string = titleInput.value.trim();
    const content: string = contentInput.value.trim();
    const moodValue: string = moodSelect.value;
    
    // Safety check ensuring data isn't missing
    if (title && content && moodValue) {
        // This mutation enforces the JournalEntry interface under the hood
        addEntry(title, content, moodValue);
        
        // Re-read the filter setting and re-render only the matched array list
        renderEntries(getEntriesByMood(filterSelect.value)); 
        form.reset();
    }
});

filterSelect.addEventListener("change", (e: Event) => {
    // Type casting the generic e.target into an explicit HTMLSelectElement to safely read `.value`
    const selectedMood = (e.target as HTMLSelectElement).value;
    const filteredNotes: JournalEntry[] = getEntriesByMood(selectedMood);
    
    renderEntries(filteredNotes);
});

// Event Delegation for Deleting
entriesList.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    
    if (target.classList.contains("delete-btn")) {
        // Find the parent HTML element housing the note 
        const parentCard = target.closest(".entry-card") as HTMLDivElement;
        const entryId = parentCard.dataset.id; // Reads the barcode ID we injected
        
        if (entryId) {
            deleteEntry(entryId);
            renderEntries(getEntriesByMood(filterSelect.value));
        }
    }
});

// Task 3 & 4: DOM rendering ensuring passed array strictly fits the `JournalEntry[]` type footprint
function renderEntries(entries: JournalEntry[]): void {
    entriesList.innerHTML = "";

    if (entries.length === 0) {
        entriesList.innerHTML = `<p class="empty-state">No journal entries found matching criteria. Add one!</p>`;
        return;
    }

    // Loops over strict TS properties (.mood, .timestamp, .title)
    entries.forEach((entry: JournalEntry) => {
        const card = document.createElement("div");
        // We use the lowercase mood variable inside literal templates to hit CSS color match algorithms!
        card.className = `entry-card mood-${entry.mood.toLowerCase()}`;
        
        // Map the secret interface ID into the physical HTML
        card.dataset.id = entry.id;

        const dateString: string = new Date(entry.timestamp).toLocaleDateString();

        card.innerHTML = `
            <div class="card-header">
                <h3>${entry.title}</h3>
                <span class="mood-badge">${entry.mood}</span>
            </div>
            <p>${entry.content}</p>
            <div class="card-footer">
                <small>${dateString}</small>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Append the crafted DOM note to the live screen container
        entriesList.appendChild(card);
    });
}
