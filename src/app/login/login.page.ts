import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private navCtrl: NavController, private authService: AuthService) {}

  login() {
    const isLoggedIn = this.authService.login(this.loginData.email, this.loginData.password);
    if (isLoggedIn) {
      alert('Inicio de sesión exitoso');
      this.navCtrl.navigateRoot('/tabs');  // Navega a la página principal después de iniciar sesión
    } else {
      alert('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');  // Navega a la página de registro
  }
}