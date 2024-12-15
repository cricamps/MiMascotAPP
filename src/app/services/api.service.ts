import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getMascotas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/mascotas`);
  }

  getMascotaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/mascotas/${id}`);
  }

  updateMascota(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/mascotas/${id}`, data);
  }
}
