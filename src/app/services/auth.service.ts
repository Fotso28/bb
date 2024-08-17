import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  register(username: string, telephone: string, localite: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, telephone, password, localite });
  }

  login(telephone: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { telephone, password });
  }

  resetPassword(telephone: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { telephone, newPassword });
  }

  logout() {
    // Implémenter la déconnexion en fonction des besoins
    this.router.navigate(['login']);
  }

  isAuthenticated(): boolean{
    return !!this.userService.getActiveUser()
  }

  
}
