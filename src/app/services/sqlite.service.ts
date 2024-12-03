
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {}

  async initializeDatabase() {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'app_database.db',
        location: 'default',
      });

      // Create posts table if it doesn't exist
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY,
          title TEXT,
          body TEXT
        )`, []);

      // Create mascotas table with all fields
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS mascotas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          edad INTEGER,
          raza TEXT,
          color TEXT,
          photo TEXT,
          latitude REAL,
          longitude REAL,
          userId INTEGER
        )`, []);

      // Create usuarios table with role if it doesn't exist
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          email TEXT,
          role TEXT DEFAULT 'user'
        )`, []);

      // Ensure admin user exists
      await this.dbInstance.executeSql(
        `INSERT OR IGNORE INTO usuarios (username, password, email, role) VALUES (?, ?, ?, ?)`,
        ['admin', 'admin123', 'admin@example.com', 'admin']
      );
    } catch (error) {
      console.error('Error initializing SQLite database:', error);
    }
  }

  async addMascota(nombre: string, edad: number, raza: string, color: string, photo: string | null, latitude: number | null, longitude: number | null, userId: number) {
    if (!this.dbInstance) return;
    try {
      await this.dbInstance.executeSql(
        `INSERT INTO mascotas (nombre, edad, raza, color, photo, latitude, longitude, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, edad, raza, color, photo, latitude, longitude, userId]
      );
    } catch (error) {
      console.error('Error adding mascota:', error);
    }
  }

  async getMascotasByUser(userId: number) {
    if (!this.dbInstance) return [];
    try {
      const res = await this.dbInstance.executeSql(`SELECT * FROM mascotas WHERE userId = ?`, [userId]);
      const mascotas = [];
      for (let i = 0; i < res.rows.length; i++) {
        mascotas.push(res.rows.item(i));
      }
      return mascotas;
    } catch (error) {
      console.error('Error retrieving mascotas:', error);
      return [];
    }
  }

  async deleteMascota(id: number) {
    if (!this.dbInstance) return;
    try {
      await this.dbInstance.executeSql(`DELETE FROM mascotas WHERE id = ?`, [id]);
    } catch (error) {
      console.error('Error deleting mascota:', error);
    }
  }

  async validateUser(username: string, password: string) {
    if (!this.dbInstance) {
      console.error('Database not initialized');
      return null;
    }    
    try {
      console.log('Executing SQL query for user validation');
      const res = await this.dbInstance.executeSql(
        `SELECT * FROM usuarios WHERE username = ? AND password = ?`,
        [username, password]
      );
      console.log('Query result:', res.rows.length); 
      
      return res.rows.length > 0 ? res.rows.item(0) : null;
    } catch (error) {
      console.error('Error in validateUser:', error);
      throw error;
    }
  }

  async validateUsername(username: string) {
    if (!this.dbInstance) return null;
    try {
      const res = await this.dbInstance.executeSql(
        `SELECT * FROM usuarios WHERE username = ?`,
        [username]
      );
      return res.rows.length > 0 ? res.rows.item(0) : null;
    } catch (error) {
      console.error('Error validating username:', error);
      return null;
    }
  }

  async addUser(username: string, password: string, email: string) {
    if (!this.dbInstance) return;
    try {
      await this.dbInstance.executeSql(
        `INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)`,
        [username, password, email]
      );
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async savePosts(posts: { id: number; title: string; body: string }[]) {
    if (!this.dbInstance) return;
    try {
      for (const post of posts) {
        await this.dbInstance.executeSql(
          `INSERT OR REPLACE INTO posts (id, title, body) VALUES (?, ?, ?)`,
          [post.id, post.title, post.body]
        );
      }
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  }

  async getPosts(): Promise<{ id: number; title: string; body: string }[]> {
    if (!this.dbInstance) return [];
    try {
      const res = await this.dbInstance.executeSql('SELECT * FROM posts', []);
      const posts = [];
      for (let i = 0; i < res.rows.length; i++) {
        posts.push(res.rows.item(i));
      }
      return posts;
    } catch (error) {
      console.error('Error retrieving posts:', error);
      return [];
    }
  }
}
