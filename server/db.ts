import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const dbPath = process.env.SQLITE_PATH || path.join(process.cwd(), "server", "data.sqlite")

// Ensure directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

export const db = new Database(dbPath)
db.pragma("journal_mode = WAL")


