import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  eventos = [
    { nombre: 'Vacunación', fecha: '2024-11-20' },
    { nombre: 'Visita al Veterinario', fecha: '2024-12-01' },
  ];

}
