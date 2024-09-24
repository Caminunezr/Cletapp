import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  userName: string = '';
  userEmail: string = '';
  userAvatar: string = 'assets/imgs/user-avatar.png';

  constructor(private navCtrl: NavController, private authService: AuthService) {}

  ionViewWillEnter() {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.userName = user.name;
      this.userEmail = user.email;
      if (user.avatar) {
        this.userAvatar = user.avatar;
      }
    }
  }

  viewAchievements() {
    this.navCtrl.navigateForward('/achievements');
  }

  editProfile() {
    this.navCtrl.navigateForward('/edit-profile');
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }
}