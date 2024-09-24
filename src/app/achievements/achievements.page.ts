import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
})
export class AchievementsPage implements OnInit {
  achievements: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.achievements = this.authService.getUserAchievements();
  }
}