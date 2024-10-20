import { Routes } from '@angular/router';
import { MapHomeComponent } from './componentes/map-home/map-home.component';
import { NuevoEventoComponent } from './componentes/nuevo-evento/nuevo-evento.component';

export const routes: Routes = [];
routes.push(
  { path: '', component: MapHomeComponent },
  { path: 'nuevo-evento', component: NuevoEventoComponent }
);
