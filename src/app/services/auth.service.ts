import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { SqliteService } from './sqlite.service';
import * as CryptoJS from 'crypto-js';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private sqliteService: SqliteService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const userData = await this.storageService.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(userData);
    }
  }

  async login(username: string, password: string): Promise<User | null> {
    const hashedPassword = this.hashPassword(password);
    const user = await this.sqliteService.validateUser(username, hashedPassword);
    
    if (user) {
      const userData: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      
      await this.storageService.setItem('currentUser', userData);
      await this.storageService.setItem('authToken', this.generateToken(userData));
      this.currentUserSubject.next(userData);
      return userData;
    }
    
    return null;
  }

  async register(username: string, password: string, email: string): Promise<boolean> {
    const existingUser = await this.sqliteService.validateUsername(username);
    if (existingUser) {
      return false;
    }

    const hashedPassword = this.hashPassword(password);
    await this.sqliteService.addUser(username, hashedPassword, email);
    return true;
  }

  async logout(): Promise<void> {
    await this.storageService.removeItem('currentUser');
    await this.storageService.removeItem('authToken');
    this.currentUserSubject.next(null);
    await this.router.navigate(['/login']);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storageService.getItem('authToken');
    return !!token;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUserSubject.value;
  }

  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
  }

  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  private generateToken(user: User): string {
    const tokenData = {
      id: user.id,
      username: user.username,
      role: user.role,
      timestamp: new Date().getTime()
    };
    return CryptoJS.AES.encrypt(JSON.stringify(tokenData), 'your-secret-key').toString();
  }
}