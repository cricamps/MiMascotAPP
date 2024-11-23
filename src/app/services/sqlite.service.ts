import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;
  private currentUserId: number | null = null;

  constructor(private sqlite: SQLite) {}

  async initializeDatabase() {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'mascotas.db',
        location: 'default',
      });

      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS mascotas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          edad INTEGER,
          raza TEXT,
          color TEXT,
          userId INTEGER
        )`,
        []
      );

      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          email TEXT
        )`,
        []
      );

      console.log('Base de datos inicializada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      throw error;
    }
  }

  async addMascota(nombre: string, edad: number, raza: string, color: string, userId: number) {
    if (!this.dbInstance) {
      throw new Error('Base de datos no inicializada');
    }
    const query = `INSERT INTO mascotas (nombre, edad, raza, color, userId) VALUES (?, ?, ?, ?, ?)`;
    await this.dbInstance.executeSql(query, [nombre, edad, raza, color, userId]);
  }

  async getMascotasByUser(userId: number) {
    if (!this.dbInstance) {
      throw new Error('Base de datos no inicializada');
    }
    const query = `SELECT * FROM mascotas WHERE userId = ?`;
    const res = await this.dbInstance.executeSql(query, [userId]);
    const mascotas = [];
    for (let i = 0; i < res.rows.length; i++) {
      mascotas.push(res.rows.item(i));
    }
    return mascotas;
  }

  async deleteMascota(id: number) {
    if (!this.dbInstance) {
      throw new Error('Base de datos no inicializada');
    }
    const query = `DELETE FROM mascotas WHERE id = ?`;
    await this.dbInstance.executeSql(query, [id]);
  }

  async addUser(username: string, password: string, email: string) {
    if (!this.dbInstance) {
      throw new Error('Base de datos no inicializada');
    }
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    await this.dbInstance.executeSql(query, [username, password, email]);
  }

  async validateUser(username: string, password: string) {
    if (!this.dbInstance) {
      throw new Error('Base de datos no inicializada');
    }
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const res = await this.dbInstance.executeSql(query, [username, password]);
    if (res.rows.length > 0) {
      const user = res.rows.item(0);
      this.currentUserId = user.id;
      return user;
    }
    return null;
  }

  getCurrentUserId() {
    return this.currentUserId;
  }
}
