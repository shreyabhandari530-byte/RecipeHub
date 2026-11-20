const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'database', 'recipehub.db');
const SCHEMA_PATH = path.join(__dirname, '..', 'database', 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to SQLite
const db = new Database(DB_PATH, {
  // verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Enable SQLite foreign keys enforcement
db.pragma('foreign_keys = ON');

// Initialize tables from schema.sql
try {
  if (fs.existsSync(SCHEMA_PATH)) {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schemaSql);
  }
} catch (error) {
  console.error('Failed to initialize database schema:', error);
}

module.exports = db;
