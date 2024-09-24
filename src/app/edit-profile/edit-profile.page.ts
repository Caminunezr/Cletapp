import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {
  age: number = 0;
  gender: string = '';
  weight: number = 0;

  constructor(private authService: AuthService) {}

  ionViewWillEnter() {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.age = user.age || 0;
      this.gender = user.gender || '';
      this.weight = user.weight || 0;
    }
  }

  saveProfile() {
    const user = this.authService.getLoggedInUser();
    user.age = this.age;
    user.gender = this.gender;
    user.weight = this.weight;
    this.authService.updateUserProfile(user);
  }
}