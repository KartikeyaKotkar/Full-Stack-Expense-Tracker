const db = new Dexie("ExpenseTrackerDB");

db.version(1).stores({
    users: "++id, username",
    expenses: "++id, category, amount, comments, createdAt, updatedAt"
});

window.db = db;