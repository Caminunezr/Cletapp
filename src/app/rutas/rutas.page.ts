import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rutas',
  templateUrl: 'rutas.page.html',
  styleUrls: ['rutas.page.scss'],
})
export class RutasPage {

  rutasGuardadas: any[] = [
    { nombre: 'Ruta 1', distancia: '5.2 km', tiempo: '24:15 min' },
    { nombre: 'Ruta 2', distancia: '3.8 km', tiempo: '18:30 min' },
    { nombre: 'Ruta 3', distancia: '7.1 km', tiempo: '35:10 min' },
  ];

  constructor(private navCtrl: NavController) {}

  verRuta(ruta: any) {  // Se ha especificado el tipo any para el parámetro ruta
    // Aquí puedes implementar la lógica para ver los detalles de la ruta seleccionada
    console.log('Ver detalles de la ruta:', ruta);
  }

  iniciarNuevaRuta() {
    this.navCtrl.navigateForward('/track-route');
  }
}