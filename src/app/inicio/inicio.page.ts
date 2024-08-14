import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class InicioPage {

  constructor(private navCtrl: NavController) {}

  startNewRoute() {
    this.navCtrl.navigateForward('/track-route');
  }

  viewSavedRoutes() {
    this.navCtrl.navigateForward('/rutas');
  }

  viewStats() {
    this.navCtrl.navigateForward('/estadisticas');
  }

}