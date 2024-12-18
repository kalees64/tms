import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  apiUrl = environment.API_URI;

  constructor(private http: HttpClient) {}

  async getProfiles(): Promise<any> {
    const url = `${this.apiUrl}/profiles`;

    return await firstValueFrom(this.http.get(url));
  }
}
