import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RutasPage } from './rutas.page';

const routes: Routes = [
  {
    path: '',
    component: RutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutasPageRoutingModule {}