import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private navCtrl: NavController, private authService: AuthService) {}

  register() {
    const isRegistered = this.authService.register(this.registerData);
    if (isRegistered) {
      alert('Registro exitoso');
      this.navCtrl.navigateRoot('/login');  // Navega a la página de login después de registrar
    } else {
      alert('El usuario ya está registrado. Por favor, usa un correo diferente.');
    }
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');  // Navega a la página de inicio de sesión
  }
}