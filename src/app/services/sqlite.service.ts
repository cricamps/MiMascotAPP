
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import * as CryptoJS from 'crypto-js';

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
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          email TEXT
        )`,
        []
      );

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

      console.log('Database initialized successfully.');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  }

  async addUser(username: string, password: string, email: string) {
    if (!this.dbInstance) throw new Error('Database not initialized');

    const hashedPassword = await this.hashPassword(password);
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    try {
      await this.dbInstance.executeSql(query, [username, hashedPassword, email]);
      console.log('User added successfully:', username);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    if (!this.dbInstance) throw new Error('Database not initialized');

    console.log('Validating user:', username);
    const query = `SELECT * FROM users WHERE username = ?`;
    try {
      const res = await this.dbInstance.executeSql(query, [username]);
      if (res.rows.length > 0) {
        const user = res.rows.item(0);
        console.log('User found in DB:', user);

        const hashedPassword = await this.hashPassword(password);
        console.log('Provided password hash:', hashedPassword);

        if (hashedPassword === user.password) {
          console.log('Password matches!');
          this.currentUserId = user.id;
          return user;
        } else {
          console.log('Password does not match!');
        }
      } else {
        console.log('No user found with this username.');
      }
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      throw error;
    }
  }

  async validateUsername(username: string): Promise<boolean> {
    if (!this.dbInstance) throw new Error('Database not initialized');

    const query = `SELECT * FROM users WHERE username = ?`;
    try {
      const res = await this.dbInstance.executeSql(query, [username]);
      return res.rows.length > 0;
    } catch (error) {
      console.error('Error validating username:', error);
      throw error;
    }
  }

  async addMascota(nombre: string, edad: number, raza: string, color: string, userId: number) {
    if (!this.dbInstance) throw new Error('Database not initialized');

    const query = `INSERT INTO mascotas (nombre, edad, raza, color, userId) VALUES (?, ?, ?, ?, ?)`;
    try {
      await this.dbInstance.executeSql(query, [nombre, edad, raza, color, userId]);
      console.log('Mascota added successfully:', nombre);
    } catch (error) {
      console.error('Error adding mascota:', error);
      throw error;
    }
  }

  async getMascotasByUser(userId: number): Promise<any[]> {
    if (!this.dbInstance) throw new Error('Database not initialized');

    const query = `SELECT * FROM mascotas WHERE userId = ?`;
    try {
      const res = await this.dbInstance.executeSql(query, [userId]);
      const mascotas = [];
      for (let i = 0; i < res.rows.length; i++) {
        mascotas.push(res.rows.item(i));
      }
      console.log('Mascotas for user:', mascotas);
      return mascotas;
    } catch (error) {
      console.error('Error fetching mascotas by user:', error);
      throw error;
    }
  }

  async deleteMascota(id: number) {
    if (!this.dbInstance) throw new Error('Database not initialized');

    const query = `DELETE FROM mascotas WHERE id = ?`;
    try {
      await this.dbInstance.executeSql(query, [id]);
      console.log('Mascota deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting mascota:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<any[]> {
    if (!this.dbInstance) {
      throw new Error('Database not initialized');
    }
    const query = 'SELECT * FROM users';
    try {
      const res = await this.dbInstance.executeSql(query, []);
      const users = [];
      for (let i = 0; i < res.rows.length; i++) {
        users.push(res.rows.item(i));
      }
      console.log('Registered users:', users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}
