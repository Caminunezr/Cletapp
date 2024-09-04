import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-rutas',
  templateUrl: 'rutas.page.html',
  styleUrls: ['rutas.page.scss'],
})
export class RutasPage implements OnInit {
  rutasGuardadas: any[] = [];

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  ngOnInit() {
    this.cargarRutasGuardadas(); // Cargar rutas guardadas cuando la página se inicializa
  }

  cargarRutasGuardadas() {
    const rutas = localStorage.getItem('rutasGuardadas');
    if (rutas) {
      this.rutasGuardadas = JSON.parse(rutas);
    }
  }

  verRuta(ruta: any) {
    console.log('Ver detalles de la ruta:', ruta);
  }

  iniciarNuevaRuta() {
    this.navCtrl.navigateForward('/track-route');
  }

  async editarNombreRuta(index: number) {
    const alert = await this.alertController.create({
      header: 'Editar Nombre de Ruta',
      inputs: [
        {
          name: 'nuevoNombre',
          type: 'text',
          placeholder: 'Nuevo Nombre',
          value: this.rutasGuardadas[index].nombre
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.rutasGuardadas[index].nombre = data.nuevoNombre;
            localStorage.setItem('rutasGuardadas', JSON.stringify(this.rutasGuardadas));
          }
        }
      ]
    });

    await alert.present();
  }
}