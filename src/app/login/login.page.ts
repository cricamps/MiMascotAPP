import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router) {}

  login() {
    const validUser = 'admin';
    const validPassword = '1234';

    if (this.username === validUser && this.password === validPassword) {
      this.error = '';
      this.router.navigate(['/inicio']);
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }

  clearField(field: string) {
    if (field === 'username') {
      this.username = '';
    } else if (field === 'password') {
      this.password = '';
    }
  }
}
