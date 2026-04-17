// SQLite Database Service - Native platforms (iOS/Android)
// Provides database access for order persistence
// Uses expo-sqlite for on-device relational data storage

import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('blockcart.db');
  }
  return db;
}

export async function initOrdersTable(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderNumber TEXT UNIQUE,
      items TEXT,
      total REAL,
      status TEXT,
      paymentMethod TEXT,
      shippingAddress TEXT,
      createdAt TEXT
    );
  `);
}

export async function getAllOrders(): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM orders ORDER BY createdAt DESC'
  );
}

export async function insertOrder(
  orderNumber: string,
  items: string,
  total: number,
  status: string,
  paymentMethod: string,
  shippingAddress: string,
  createdAt: string
): Promise<{ lastInsertRowId: number }> {
  const database = await getDatabase();
  return await database.runAsync(
    `INSERT INTO orders (orderNumber, items, total, status, paymentMethod, shippingAddress, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    orderNumber, items, total, status, paymentMethod, shippingAddress, createdAt
  );
}
