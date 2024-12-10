import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracionesPageRoutingModule } from './configuraciones-routing.module';

import { ConfiguracionesPage } from './configuraciones.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracionesPageRoutingModule,
    TranslateModule
  ],
  declarations: [ConfiguracionesPage]
})
export class ConfiguracionesPageModule {}
