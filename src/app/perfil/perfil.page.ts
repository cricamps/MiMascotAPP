import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  mascota = {
    nombre: 'Luna',
    edad: '2 años',
    vacunas: ['Rabia', 'Parvovirus'],
  };

}
