import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

  totalKm = 120.5;
  totalTime = '6h 45m';
  averageSpeed = 18.2;

  constructor() { }

  ngOnInit() {
    // Aquí podrías cargar estadísticas reales desde un servicio
  }
}