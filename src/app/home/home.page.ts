import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userCount: number = 0;
  petCount: number = 0;

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async ngOnInit() {
    await this.loadStatistics();
  }

  async loadStatistics() {
    try {
      const stats = await this.sqliteService.getStatistics();
      this.userCount = stats.userCount;
      this.petCount = stats.petCount;
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  navigateToUserList() {
    this.router.navigate(['/user-list']); // Cambia '/user-list' por la ruta correcta
  }
}
