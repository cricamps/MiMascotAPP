import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController 
  ) {}

  async login() {
    console.log('Iniciando login...');
    try {
      const user = await this.authService.login(this.username, this.password);
      if (user) {
        await this.router.navigate([user.role === 'admin' ? '/home' : '/inicio']);
      } else {
        await this.showAlert('Error', 'Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error:', error);
      await this.showAlert('Error', 'Error en inicio de sesión');
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