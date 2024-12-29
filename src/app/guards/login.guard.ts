import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate : CanActivateFn = async (route, state) => {
    try {
      await this.authService.initDatabase();
      const isAuthenticated = await this.authService.isAuthenticated();
      if (isAuthenticated) {
        this.router.navigate(['']);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification de l’authentification :', error);
      return true; // Autoriser l’accès en cas d'erreur
    }
  };
  
}
