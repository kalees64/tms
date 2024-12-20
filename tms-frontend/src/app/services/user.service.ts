import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { USER } from '../components/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.API_URI;

  user = signal<USER | null>(null);

  constructor(private http: HttpClient) {
    this.setUserData();
  }

  // Auth Functions

  async login(loginData: { email: string; password: string }): Promise<any> {
    const url = `${this.apiUrl}/auth/login`;

    return await firstValueFrom(this.http.post(url, loginData));
  }

  async register(registerData: {
    name: string;
    email: string;
    password: string;
    profileId: string;
  }): Promise<any> {
    const url = `${this.apiUrl}/auth/register`;

    return await firstValueFrom(this.http.post(url, registerData));
  }

  async setUserData() {
    const res = await this.getUserFromLocalStorage();

    this.user.set(res);
  }

  async getTokenFromLocalStorage() {
    const userData = await localStorage.getItem('userData');

    if (userData) {
      const data = JSON.parse(userData);

      const token = data.token;

      return token;
    }
  }

  getAuthTokenFromLocalStorage() {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const data = JSON.parse(userData);

      const token = data.token;

      return token;
    }
  }

  async getUserRoleFromLocalStorage() {
    const userData = await localStorage.getItem('userData');

    if (userData) {
      const data = JSON.parse(userData);

      const profile = data.user.profiles[0];

      return profile;
    }
  }

  getUserRoleAuthFromLocalStorage() {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const data = JSON.parse(userData);

      const profile = data.user.profiles[0];

      return profile;
    }
  }

  async getUserFromLocalStorage() {
    const userData = await localStorage.getItem('userData');

    if (userData) {
      const data = JSON.parse(userData);

      const user = data.user;

      return user;
    }
  }

  async getUserIdFromLocalStorage() {
    const userData = await localStorage.getItem('userData');

    if (userData) {
      const data = JSON.parse(userData);

      const user = data.user;

      return user.id;
    }
  }

  // User service functions

  async getUsers(): Promise<any> {
    const url = `${this.apiUrl}/users`;

    return await firstValueFrom(this.http.get(url));
  }
}
