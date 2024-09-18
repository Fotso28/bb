import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.service';
import { DataInitializationService } from './data-initialization.service';
import { BdService } from './-bd.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, 
    private router: Router, private bdSvc: BdService,
    private dataInit: DataInitializationService) {}

  register(username: string, telephone: string, localite: string, password: string, phoneId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, telephone, password, localite, phoneId });
  }

  login(telephone: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { telephone, password });
  }

  resetPassword(telephone: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { telephone, newPassword });
  }

  logout() {
    // Implémenter la déconnexion en fonction des besoins
    this.dataInit.clearParamsData();
    this.router.navigateByUrl('/login');
  }

  async isAuthenticated(): Promise<boolean>{
    return !!(await this.bdSvc.getActiveUser())
  }

  
}
