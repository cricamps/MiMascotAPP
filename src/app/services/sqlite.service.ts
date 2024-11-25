import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {}

  async initializeDatabase() {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'mascotas.db', // Nombre de la base de datos
        location: 'default', // Almacenamiento por defecto
      });

      // Crear tabla si no existe
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS mascotas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          edad INTEGER,
          raza TEXT,
          color TEXT
        )`,
        []
      );

      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS usuarios (
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
    }
  }

  async addMascota(nombre: string, edad: number, raza: string, color: string, userId: number): Promise<void> {
    if (!this.dbInstance) throw new Error('Database not initialized');
  
    const query = `INSERT INTO mascotas (nombre, edad, raza, color, userId) VALUES (?, ?, ?, ?, ?)`;
    try {
      await this.dbInstance.executeSql(query, [nombre, edad, raza, color, userId]);
      console.log('Mascota añadida con éxito:', nombre);
    } catch (error) {
      console.error('Error al añadir mascota:', error);
      throw error;
    }
  }
  
  async getMascotas() {
    const query = `SELECT * FROM mascotas`;
    try {
      const res = await this.dbInstance?.executeSql(query, []);
      const mascotas = [];
      if (res) {
        for (let i = 0; i < res.rows.length; i++) {
          mascotas.push(res.rows.item(i));
        }
      }
      console.log('Mascotas recuperadas:', mascotas);
      return mascotas;
    } catch (error) {
      console.error('Error al obtener mascotas:', error);
      return [];
    }
  }

  async validateUsername(username: string): Promise<boolean> {
    if (!this.dbInstance) throw new Error('Database not initialized');

    const query = `SELECT * FROM usuarios WHERE username = ?`;
    try {
      const res = await this.dbInstance.executeSql(query, [username]);
      return res.rows.length > 0; // Retorna true si existe
    } catch (error) {
      console.error('Error validating username:', error);
      throw error;
    }
  }

  async getStatistics(): Promise<{ userCount: number; petCount: number }> {
    if (!this.dbInstance) throw new Error('Database not initialized');
  
    const userCountQuery = `SELECT COUNT(*) as userCount FROM users`;
    const petCountQuery = `SELECT COUNT(*) as petCount FROM mascotas`;
  
    try {
      const userCountRes = await this.dbInstance.executeSql(userCountQuery, []);
      const petCountRes = await this.dbInstance.executeSql(petCountQuery, []);
  
      const userCount = userCountRes.rows.item(0).userCount || 0;
      const petCount = petCountRes.rows.item(0).petCount || 0;
  
      return { userCount, petCount };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
  
  

  async validateUser(username: string, password: string): Promise<any> {
    if (!this.dbInstance) throw new Error('Database not initialized');
  
    const query = `SELECT * FROM uausarios WHERE username = ?`;
    try {
      const res = await this.dbInstance.executeSql(query, [username]);
      if (res.rows.length > 0) {
        const user = res.rows.item(0);
        const hashedPassword = await this.hashPassword(password);
        if (hashedPassword === user.password) {
          return { id: user.id, role: user.role };
        }
      }
      return null;
    } catch (error) {
      console.error('Error validando usuario:', error);
      throw error;
    }
  }

  hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  }
  
  async addUser(username: string, password: string, email: string): Promise<void> {
    if (!this.dbInstance) throw new Error('Database not initialized');
  
    const hashedPassword = this.hashPassword(password); // Asegúrate de usar hashing
    const query = `INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)`;
    try {
      await this.dbInstance.executeSql(query, [username, hashedPassword, email]);
      console.log('Usuario agregado con éxito:', username);
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
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
      return mascotas;
    } catch (error) {
      console.error('Error fetching mascotas by user:', error);
      throw error;
    }
  }
  

  // Eliminar una mascota por ID
  async deleteMascota(id: number) {
    const query = `DELETE FROM mascotas WHERE id = ?`;
    return this.dbInstance?.executeSql(query, [id]);
  }
}
