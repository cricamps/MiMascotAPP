import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  error: string | null = null;

  constructor(
    private sqliteService: SqliteService, 
    private router: Router,
    private alertController: AlertController 
  ) {}

  async login() {
    console.log('Iniciando login...'); 
    
    if (!this.username || !this.password) {
      this.showAlert('Error', 'Por favor, completa todos los campos');
      return;
    }

    try {
      console.log('Validando usuario:', this.username); 
      const user = await this.sqliteService.validateUser(this.username, this.password);
      console.log('Respuesta de validación:', user);

      if (user) {
        console.log('Usuario validado, rol:', user.role);
        if (user.role === 'admin') {
          await this.router.navigate(['/home']);
        } else {
          await this.router.navigate(['/inicio']);
        }
      } else {
        await this.showAlert('Error', 'Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      await this.showAlert('Error', 'Hubo un problema al iniciar sesión');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  clearField(field: 'username' | 'password'): void {
    if (field === 'username') {
      this.username = '';
    } else if (field === 'password') {
      this.password = '';
    }
  }
}