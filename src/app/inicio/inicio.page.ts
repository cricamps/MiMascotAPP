import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  mascotas = [
    { nombre: 'Luna' },
    { nombre: 'Jazmín' },
    { nombre: 'Raya' },
  ];

  constructor(private animationCtrl: AnimationController) {}

  ngOnInit() {
    this.playAnimation();
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
}
