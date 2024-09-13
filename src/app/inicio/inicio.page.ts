import { Component, AfterViewInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, NavController } from '@ionic/angular';

declare var google: any; // Declaración para usar la API de Google Maps

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements AfterViewInit {
  isTracking = false;
  trackedRoute: { lat: number; lng: number; }[] = [];
  currentPosition: any;
  map: any; // Variable para almacenar la instancia del mapa
  marker: any; // Marcador para la ubicación actual
  polyline: any; // Polyline para dibujar la ruta en el mapa
  savedRoutes: any[] = []; // Array para guardar las rutas

  startTime: Date = new Date();
  endTime: Date = new Date();
  totalDistance: number = 0;
  elapsedTime: string = '0h 0m'; // Tiempo transcurrido
  currentStreet: string = ''; // Nombre de la calle actual
  currentWeather: any = { temp: '', condition: '', icon: '' }; // Información del clima

  timerInterval: any; // Intervalo para actualizar el tiempo transcurrido

  constructor(private alertController: AlertController, private navCtrl: NavController) {} // Inyecta NavController

  ngAfterViewInit() {
    this.loadMap();
    this.loadSavedRoutes(); // Cargar rutas guardadas al inicio
  }

  async loadMap() {
    const coordinates = await Geolocation.getCurrentPosition();
    const latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);

    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Ubicación Actual'
    });

    // Inicializa la Polyline para trazar la ruta en el mapa
    this.polyline = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#FF0000', // Color de la línea (puedes cambiarlo)
      strokeOpacity: 1.0,
      strokeWeight: 4, // Grosor de la línea
      map: this.map
    });

    this.updateWeather(coordinates.coords.latitude, coordinates.coords.longitude);
  }

  async startNewRoute() {
    if (this.isTracking) {
      this.stopTracking();
    } else {
      this.isTracking = true;
      this.trackedRoute = [];
      this.totalDistance = 0;
      this.startTime = new Date(); // Registrar la hora de inicio

      // Limpia la Polyline al comenzar una nueva ruta
      this.polyline.setPath([]);

      // Inicializar el contador de tiempo
      this.timerInterval = setInterval(() => this.updateElapsedTime(), 1000);

      // Obtener la posición actual
      const coordinates = await Geolocation.getCurrentPosition();
      this.currentPosition = coordinates;

      this.updateCurrentStreet(coordinates.coords); // Obtener la calle actual

      // Muestra alerta de inicio de ruta
      const alert = await this.alertController.create({
        header: 'Nueva Ruta Iniciada',
        message: 'El rastreo de ruta ha comenzado.',
        buttons: ['OK']
      });
      await alert.present();

      this.updateWeather(coordinates.coords.latitude, coordinates.coords.longitude); // Actualizar clima

      this.trackPosition();
    }
  }

  async trackPosition() {
    let lastPosition: { latitude: number; longitude: number; } | null = null; // Definir tipo explícitamente

    const watchId = await Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        const newLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.trackedRoute.push({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        // Añadir el nuevo punto al Polyline para trazar la ruta
        const path = this.polyline.getPath();
        path.push(newLatLng);
        this.polyline.setPath(path); // Actualizar la Polyline con la nueva ruta

        if (lastPosition) {
          this.totalDistance += this.calculateDistance(lastPosition, position.coords);
        }

        lastPosition = position.coords; // Actualizar lastPosition con la nueva posición
        this.marker.setPosition(newLatLng); // Actualizar la posición del marcador en el mapa
        this.map.setCenter(newLatLng); // Centrar el mapa en la nueva posición
        this.updateCurrentStreet(position.coords); // Actualizar la calle actual
        console.log('Tracking position:', position);
      }
    });
  }

  async updateWeather(lat: number, lon: number) {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=8232ad247b894865bba42257242005&q=${lat},${lon}`);
      const data = await response.json();
      this.currentWeather.temp = data.current.temp_c + '°C';
      this.currentWeather.condition = data.current.condition.text;
      this.currentWeather.icon = data.current.condition.icon;
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  stopTracking() {
    this.isTracking = false;
    this.endTime = new Date(); // Registrar la hora de término

    clearInterval(this.timerInterval); // Detener el contador de tiempo

    const elapsedTime = this.calculateElapsedTime(this.startTime, this.endTime); // Calcular tiempo transcurrido

    // Determinar el nombre dinámico basado en la hora de inicio
    const dynamicName = this.generateRouteName(this.startTime);

    // Crear un nuevo objeto de ruta con más detalles
    const nuevaRuta = {
      nombre: dynamicName,
      fecha: this.startTime.toLocaleDateString(),
      horaInicio: this.startTime.toLocaleTimeString(),
      horaTermino: this.endTime.toLocaleTimeString(),
      tiempoTranscurrido: elapsedTime,
      distancia: this.totalDistance.toFixed(2) + ' km',
      ruta: this.trackedRoute
    };

    // Agregar la nueva ruta al principio del array
    this.savedRoutes.unshift(nuevaRuta);

    // Guardar el array actualizado en localStorage
    localStorage.setItem('rutasGuardadas', JSON.stringify(this.savedRoutes));
    console.log('Ruta guardada:', nuevaRuta);

    // Mostrar una alerta al usuario
    this.alertController.create({
      header: 'Ruta Guardada',
      message: 'Tu ruta ha sido guardada exitosamente.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  updateElapsedTime() {
    const now = new Date();
    const diffMs = now.getTime() - this.startTime.getTime();
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
    const diffSecs = Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000);
    this.elapsedTime = `${diffHrs}h ${diffMins}m ${diffSecs}s`;
}

  async updateCurrentStreet(coords: { latitude: number; longitude: number; }) {
    const geocoder = new google.maps.Geocoder();
    const latlng = {
      lat: coords.latitude,
      lng: coords.longitude
    };

    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.currentStreet = results[0].formatted_address; // Actualizar el nombre de la calle actual
      } else {
        this.currentStreet = 'Desconocida';
      }
    });
  }

  generateRouteName(startTime: Date): string {
    const hours = startTime.getHours();
    if (hours >= 5 && hours < 12) {
      return "Ruta de la Mañana";
    } else if (hours >= 12 && hours < 18) {
      return "Ruta de la Tarde";
    } else {
      return "Ruta de la Noche";
    }
  }

  loadSavedRoutes() {
    const storedRoutes = localStorage.getItem('rutasGuardadas');
    if (storedRoutes) {
      this.savedRoutes = JSON.parse(storedRoutes);
    }
  }

  calculateDistance(startCoords: { latitude: number; longitude: number; }, endCoords: { latitude: number; longitude: number; }): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (endCoords.latitude - startCoords.latitude) * Math.PI / 180;
    const dLon = (endCoords.longitude - startCoords.longitude) * Math.PI / 180;
    const a = 
      0.5 - Math.cos(dLat)/2 + 
      Math.cos(startCoords.latitude * Math.PI / 180) * Math.cos(endCoords.latitude * Math.PI / 180) * 
      (1 - Math.cos(dLon))/2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  calculateElapsedTime(startTime: Date, endTime: Date): string {
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}m`;
  }

  viewSavedRoutes() {
    this.navCtrl.navigateRoot('/tabs/rutas'); // Navegar a la tab de Rutas Guardadas
  }

  viewStats() {
    this.navCtrl.navigateRoot('/tabs/estadisticas'); // Navegar a la tab de Estadísticas
  }

  // Generar mensaje motivacional o advertencia en base al clima
  generateWeatherMessage(temp: string): string {
    const temperature = parseFloat(temp);
    if (temperature > 35) {
      return 'La temperatura es muy alta. ¡Ten cuidado al salir! Mantente hidratado y evita largas exposiciones al sol.';
    } else if (temperature < 5) {
      return 'Hace mucho frío afuera. Asegúrate de abrigarte bien antes de salir a tu recorrido.';
    } else {
      return 'La temperatura es agradable. ¡Disfruta tu recorrido!';
    }
  }
}