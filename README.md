# Personal Mood Journal 📔

A dynamic, strictly typed client-side application built to demonstrate mastery of TypeScript fundamentals. Users can create, filter, and delete personal journal entries mapped to specific emotional states, with all data securely persisted in `localStorage`.

##  Technical Focus

This project was built from scratch with a primary focus on TypeScript's type system, interfaces, and tooling. The codebase strictly adheres to `"strict": true` compiler configurations with **zero successful builds containing type errors**. 

Key TypeScript concepts demonstrated:
* **Interfaces:** Rigid structural contracts for the `JournalEntry` domain model.
* **Enums:** Controlled, immutable state management using a `Mood` enum to prevent invalid string assignment.
* **Generics:** A highly reusable `<T>` generic utility function (`findByProperty`) capable of safely querying any array footprint.
* **Type Assertions:** Gracefully parsing raw `localStorage` strings and strictly asserting them `as JournalEntry[]`.
* **DOM Casting:** Explicitly casting UI elements (e.g. `as HTMLInputElement`) to enforce type-safe event listeners and template rendering.

##  Getting Started

Since this project leverages ES6 Module definitions, it must be served over a local web server (opening the index file directly via `file:///` will trigger CORS blocks).

### 1. Installation & Compilation
```bash
# Install development dependencies (typescript, ts-node)
npm install

# Compile the strict TypeScript files into the /dist directory
npx tsc
```

### 2. Running Locally
Using Node's native serve utility:
```bash
npx serve .
```
Or, if you are using VS Code, simply right-click `index.html` and select **"Open with Live Server"**.

## Project Structure
* `src/journal.ts`: Core business logic, Type Aliases, Interfaces, Enums, and Generics.
* `src/storage.ts`: Type-safe Data serialization mechanics.
* `src/ui.ts`: Heavily typed DOM manipulation and Event Delegation.
* `index.html` & `styles.css`: Custom, responsive UI architecture.
