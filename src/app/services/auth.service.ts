import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = JSON.parse(localStorage.getItem('users') || '[]');
  private loggedInUser: any = null;

  constructor() {}

  // Registrar un nuevo usuario
  register(user: any): boolean {
    const userExists = this.users.some(
      (u: any) => u.email === user.email
    );
    if (!userExists) {
      this.users.push(user);
      localStorage.setItem('users', JSON.stringify(this.users));
      return true; // Registrado exitosamente
    }
    return false; // El usuario ya existe
  }

  // Iniciar sesión
  login(email: string, password: string): boolean {
    const user = this.users.find(
      (u: any) => u.email === email && u.password === password
    );
    if (user) {
      this.loggedInUser = user;
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true; // Login exitoso
    }
    return false; // Credenciales incorrectas
  }

  // Cerrar sesión
  logout() {
    this.loggedInUser = null;
    localStorage.removeItem('loggedInUser');
  }

  // Obtener el usuario actualmente logueado
  getLoggedInUser(): any {
    if (!this.loggedInUser) {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    }
    return this.loggedInUser;
  }

  // Actualizar perfil del usuario
  updateUserProfile(user: any) {
    const userIndex = this.users.findIndex((u: any) => u.email === user.email);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      this.loggedInUser = user;
    }
  }

  // Obtener logros del usuario
  getUserAchievements(): any[] {
    return [
      { title: 'Primer Recorrido', description: 'Completaste tu primer recorrido.' },
      { title: '5 KM Recorridos', description: 'Has recorrido un total de 5 km.' },
      { title: '10 KM Recorridos', description: 'Has recorrido un total de 10 km.' },
    ];
  }
}