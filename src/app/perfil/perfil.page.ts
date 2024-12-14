import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  mascota: any;
  mostrarImagenesOpciones = false;
  imagenesPrecargadas: string[] = [
    'assets/img/mascota1.png',
    'assets/img/mascota2.png',
    'assets/img/mascota3.png',
  ];

  constructor(private router: Router, private storageService: StorageService) {}

  async ngOnInit() {
    const navigation = await this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['mascota']) {
      this.mascota = navigation.extras.state['mascota'];
      console.log('Datos de la mascota recibidos:', this.mascota);
      const storedData = await this.storageService.getItem(`mascota_${this.mascota.id}`);
      if (storedData && storedData.foto) {
        this.mascota.foto = storedData.foto;
      }  
    } else {
      console.error('No se recibieron datos de la mascota.');
    }
  }

  async tomarFoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });
      if (photo && this.mascota) {
        this.mascota.foto = photo.dataUrl;
        console.log('Foto tomada:', this.mascota.foto);
        await this.storageService.setItem(`mascota_${this.mascota.id}`, { foto: photo.dataUrl });
        console.log('Foto guardada:', this.mascota.foto);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
    }
  }

  async mostrarImagenes() {
    this.mostrarImagenesOpciones = !this.mostrarImagenesOpciones;
  }

  async elegirFoto(imagenSeleccionada: string) {
    this.mascota.foto = imagenSeleccionada;
    this.mostrarImagenesOpciones = false;
    await this.storageService.setItem(`mascota_${this.mascota.id}`, { foto: this.mascota.foto });
    console.log('Foto elegida y guardada:', this.mascota.foto);
  }

  async guardarCambios() {
    if (this.mascota) {
      await this.storageService.setItem(`mascota_${this.mascota.id}`, { foto: this.mascota.foto });
      console.log('Cambios guardados para la mascota:', this.mascota);
      this.router.navigate(['/inicio']);
    }
  }
}
