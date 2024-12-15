import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.page.html',
  styleUrls: ['./geolocalizacion.page.scss'],
})
export class GeolocalizacionPage {
  geolocalizacion: { lat: number; lng: number } | null = null;

  constructor(private geolocation: Geolocation) {}

  obtenerGeolocalizacion() {
    this.geolocation.getCurrentPosition().then(
      (resp) => {
        this.geolocalizacion = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
        };
        console.log('Geolocalización obtenida:', this.geolocalizacion);
      },
      (error) => {
        console.error('Error al obtener la geolocalización:', error);
      }
    );
  }
}
