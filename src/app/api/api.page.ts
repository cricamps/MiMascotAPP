import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.page.html',
  styleUrls: ['./api.page.scss'],
})
export class ApiPage {
  apiData: any[] = [];

  constructor(private apiService: ApiService) {}

  accederApi() {
    this.apiService.getMascotas().subscribe({
      next: (data) => {
        this.apiData = data;
        console.log('Datos obtenidos de la API:', data);
      },
      error: (error) => {
        console.error('Error al acceder a la API:', error);
        console.log('Detalles del error:', {
          status: error.status,
          message: error.message,
          url: error.url,
        });
      },
      complete: () => {
        console.log('Petición a la API completada');
      },
    });
  }
}
