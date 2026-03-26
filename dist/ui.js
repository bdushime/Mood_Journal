import { addEntry, updateEntry, deleteEntry, getEntriesByMood, initializeJournal, currentJournal } from "./journal.js";
// --- DOM Element References with Type Assertions ---
const form = document.getElementById("journal-form");
const titleInput = document.getElementById("entry-title");
const contentInput = document.getElementById("entry-content");
const moodSelect = document.getElementById("entry-mood");
const filterSelect = document.getElementById("filter-mood");
const searchInput = document.getElementById("search-input");
const entriesList = document.getElementById("entries-list");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const formTitle = document.getElementById("form-title");
const entryCount = document.getElementById("entry-count");
const themeToggle = document.getElementById("theme-toggle");
// --- State ---
let editingId = null;
// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    initializeJournal();
    renderEntries(currentJournal);
    updateCount(currentJournal);
    // Restore saved theme preference
    const savedTheme = localStorage.getItem("moodlog_theme");
    if (savedTheme === "light")
        applyTheme("light");
});
// --- Theme Toggle ---
themeToggle.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme === "light";
    applyTheme(isLight ? "dark" : "light");
});
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("moodlog_theme", theme);
    themeToggle.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
}
// --- Form Submit: handles both Add and Edit ---
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const moodValue = moodSelect.value;
    if (!title || !content || !moodValue)
        return;
    if (editingId) {
        updateEntry(editingId, title, content, moodValue);
        exitEditMode();
    }
    else {
        addEntry(title, content, moodValue);
    }
    form.reset();
    const filtered = getFilteredAndSearched();
    renderEntries(filtered);
    updateCount(currentJournal);
});
// --- Filter change ---
filterSelect.addEventListener("change", () => {
    renderEntries(getFilteredAndSearched());
});
// --- Search input ---
searchInput.addEventListener("input", () => {
    renderEntries(getFilteredAndSearched());
});
// --- Cancel edit ---
cancelEditBtn.addEventListener("click", () => {
    exitEditMode();
    form.reset();
});
// --- Event Delegation on entries list (Delete + Edit) ---
entriesList.addEventListener("click", (e) => {
    const target = e.target;
    // Delete
    if (target.classList.contains("delete-btn")) {
        const parentCard = target.closest(".entry-card");
        const entryId = parentCard?.dataset.id;
        if (entryId) {
            deleteEntry(entryId);
            renderEntries(getFilteredAndSearched());
            updateCount(currentJournal);
        }
    }
    // Edit
    if (target.classList.contains("edit-btn")) {
        const parentCard = target.closest(".entry-card");
        const entryId = parentCard?.dataset.id;
        if (entryId) {
            const entry = currentJournal.find(e => e.id === entryId);
            if (entry)
                enterEditMode(entry);
        }
    }
});
// --- Helpers ---
/** Returns entries filtered by mood and search query simultaneously. */
function getFilteredAndSearched() {
    const moodFiltered = getEntriesByMood(filterSelect.value);
    const query = searchInput.value.trim().toLowerCase();
    if (!query)
        return moodFiltered;
    return moodFiltered.filter(e => e.title.toLowerCase().includes(query) || e.content.toLowerCase().includes(query));
}
/** Populates the form with an existing entry's values and enters edit mode. */
function enterEditMode(entry) {
    editingId = entry.id;
    titleInput.value = entry.title;
    contentInput.value = entry.content;
    moodSelect.value = entry.mood;
    formTitle.textContent = "✏️ Edit Entry";
    submitBtn.textContent = "Update Entry";
    cancelEditBtn.style.display = "block";
    form.scrollIntoView({ behavior: "smooth" });
}
/** Resets form UI back to "Add" mode. */
function exitEditMode() {
    editingId = null;
    formTitle.textContent = "✍️ New Entry";
    submitBtn.textContent = "Save Entry";
    cancelEditBtn.style.display = "none";
}
/** Updates the visible count of total entries. */
function updateCount(entries) {
    entryCount.textContent = `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`;
}
/** Renders the array of JournalEntry objects into the DOM. */
function renderEntries(entries) {
    entriesList.innerHTML = "";
    if (entries.length === 0) {
        entriesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📓</div>
                <p>No entries found. Start writing to track your mood!</p>
            </div>`;
        return;
    }
    const moodEmojis = {
        HAPPY: "😊", SAD: "😢", MOTIVATED: "🚀", STRESSED: "😤", CALM: "😌"
    };
    entries.forEach((entry) => {
        const card = document.createElement("div");
        card.className = `entry-card mood-${entry.mood.toLowerCase()}`;
        card.dataset.id = entry.id;
        const dateString = new Date(entry.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric"
        });
        card.innerHTML = `
            <div class="card-header">
                <div class="card-header-left">
                    <span class="mood-emoji">${moodEmojis[entry.mood] ?? "📓"}</span>
                    <h3>${entry.title}</h3>
                </div>
                <span class="mood-badge mood-badge-${entry.mood.toLowerCase()}">${entry.mood}</span>
            </div>
            <p class="card-content">${entry.content}</p>
            <div class="card-footer">
                <small class="card-date">🗓 ${dateString}</small>
                <div class="card-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `;
        entriesList.appendChild(card);
    });
}
