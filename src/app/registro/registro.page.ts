import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  username: string = '';
  password: string = '';
  email: string = '';
  error: string | null = null;

  constructor(private sqliteService: SqliteService, private router: Router) {}

  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  async register() {
    const hashedPassword = this.hashPassword(this.password);
    try {
      const existingUser = await this.sqliteService.validateUsername(this.username);
      if (existingUser) {
        this.error = 'El nombre de usuario ya está registrado.';
        return;
      }
      await this.sqliteService.addUser(this.username, hashedPassword, this.email);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al registrar usuario.';
    }
  }
}