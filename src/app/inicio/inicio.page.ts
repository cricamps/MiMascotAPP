import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  mascotas: any[] = [];
  userId: number = 1;
  apiData: any[] = [];
  geolocalizacion: { lat: number; lng: number } | null = null;

  constructor(
    private animationCtrl: AnimationController,
    private sqliteService: SqliteService,
    private router: Router,
    private apiService: ApiService,
    private geolocation: Geolocation
  ) {}

  async ngOnInit() {
    try {
      await this.sqliteService.initializeDatabase();
      await this.cargarMascotas();
      this.playAnimation();
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }

  async ionViewWillEnter() {
    await this.cargarMascotas();
  }

  async cargarMascotas() {
    try {
      this.mascotas = await this.sqliteService.getMascotasByUser(this.userId);
      console.log('Mascotas cargadas:', this.mascotas);
    } catch (error) {
      console.error('Error al cargar las mascotas:', error);
    }
  }

  verPerfilMascota(mascota: any) {
    try {
      console.log('Navegando al perfil de la mascota:', mascota);
        this.router.navigate(['/perfil'], { state: { mascota } });
      } catch (error) {
        console.error('Error al navegar al perfil de la mascota:', error);
      }
  }

  async eliminarMascota(id: number) {
    try {
      await this.sqliteService.deleteMascota(id);
      this.mascotas = await this.sqliteService.getMascotasByUser(this.userId);
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
    }
  }

  playAnimation() {
    const element = document.querySelector('.animated-list');
    if (element) {
      const animation = this.animationCtrl.create()
        .addElement(element)
        .duration(1000)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateX(-100px)', 'translateX(0)');
      animation.play();
    } else {
      console.error('Elemento no encontrado: .animated-list');
    }
  }
  accederApi() {
    this.apiService.getMascotas().subscribe(
      (data) => {
        this.apiData = data;
        console.log('Datos obtenidos de la API:', data);
      },
      (error) => {
        console.error('Error al acceder a la API:', error);
      }
    );
  }
  mostrarGeolocalizacion() {
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
