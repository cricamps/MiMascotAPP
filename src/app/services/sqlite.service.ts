import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  dbInstance!: SQLiteObject;

  constructor(private sqlite: SQLite) {}

  async initializeDatabase() {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'my_database.db',
        location: 'default',
      });

      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        )`,
        []
      );
      console.log('Base de datos inicializada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  async addItem(name: string) {
    if (!this.dbInstance) {
      throw new Error('La base de datos no está inicializada.');
    }
    const query = `INSERT INTO items (name) VALUES (?)`;
    return this.dbInstance.executeSql(query, [name]);
  }

  async getItems() {
    if (!this.dbInstance) {
      throw new Error('La base de datos no está inicializada.');
    }
    const query = `SELECT * FROM items`;
    const res = await this.dbInstance.executeSql(query, []);
    const items = [];
    for (let i = 0; i < res.rows.length; i++) {
      items.push(res.rows.item(i));
    }
    return items;
  }
}
