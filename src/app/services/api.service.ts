import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getMascotas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/mascotas`).pipe(
      catchError((error) => {
        console.error('Error al acceder a la API:', error);
        const localData = [
          { id: 1, nombre: 'Luna (Offline)', edad: 3, foto: '' },
          { id: 2, nombre: 'Jazmín (Offline)', edad: 5, foto: '' },
        ];
        return of(localData);
      })
    );
  }
  getMascotaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/mascotas/${id}`);
  }

  updateMascota(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/mascotas/${id}`, data);
  }
}
