import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mascotas',
    pathMatch: 'full'
  },
  { path: 'mascotas', loadChildren: () => import('./paginas/mascotas/mascotas.module').then(m => m.MascotasPageModule), canActivate: [AuthGuard] },
  { path: 'login', loadChildren: () => import('./paginas/login/login.module').then(m => m.LoginPageModule) },
  { path: 'mascota', loadChildren: () => import('./paginas/mascota/mascota.module').then(m => m.MascotaPageModule) },
  { path: 'mascota/:id', loadChildren: () => import('./paginas/mascota/mascota.module').then(m => m.MascotaPageModule), canActivate: [AuthGuard]  },
  { path: 'mascota-detalle', loadChildren: () => import('./paginas/mascota-detalle/mascota-detalle.module').then(m => m.MascotaDetallePageModule), canActivate: [AuthGuard] },
  { path: 'mascota-detalle/:id', loadChildren: () => import('./paginas/mascota-detalle/mascota-detalle.module').then(m => m.MascotaDetallePageModule), canActivate: [AuthGuard] },
  { path: 'mascota-tratamiento/:tipo/:idMascota', loadChildren: () => import('./paginas/mascota-tratamiento/mascota-tratamiento.module').then(m => m.MascotaTratamientoPageModule), canActivate: [AuthGuard] },
  { path: 'mascota-tratamiento/:tipo/:idMascota/:id', loadChildren: () => import('./paginas/mascota-tratamiento/mascota-tratamiento.module').then(m => m.MascotaTratamientoPageModule), canActivate: [AuthGuard] },
  { path: 'mascota-tratamientos/:tipo/:id', loadChildren: () => import('./paginas/mascota-tratamientos/mascota-tratamientos.module').then(m => m.MascotaTratamientosPageModule), canActivate: [AuthGuard] },
  { path: 'registro', loadChildren: () => import('./paginas/registro/registro.module').then(m => m.RegistroPageModule) },
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
