import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'ratemyclient.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

export const initializeDatabase = () => {
  db.serialize(() => {
    // Clients table
    db.run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        company TEXT,
        industry TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reviews table
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        red_flags TEXT,
        would_work_again BOOLEAN,
        payment_promptness INTEGER CHECK(payment_promptness >= 1 AND payment_promptness <= 5),
        communication_quality INTEGER CHECK(communication_quality >= 1 AND communication_quality <= 5),
        scope_creep_issue BOOLEAN,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);

    // AI Scans table (for job post analysis)
    db.run(`
      CREATE TABLE IF NOT EXISTS ai_scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_post_text TEXT NOT NULL,
        red_flag_score INTEGER,
        detected_flags TEXT,
        analysis TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized.');
  });
};

export default db;
