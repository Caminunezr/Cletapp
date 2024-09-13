import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userName = 'usernames';
  userEmail = 'usernames@example.com';

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    // Aquí podrías cargar la información del usuario desde un servicio
  }

  editProfile() {
    // Navegar a la página de edición de perfil
    this.navCtrl.navigateForward('/edit-profile');
  }

  viewAchievements() {
    // Navegar a la página de logros
    this.navCtrl.navigateForward('/achievements');
  }

  logout() {
    // Lógica de cierre de sesión
    console.log('Cerrar sesión');
  }
}