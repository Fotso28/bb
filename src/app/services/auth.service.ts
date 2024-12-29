import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.service';
import { DataInitializationService } from './data-initialization.service';
import { BdService } from './-bd.service';
import { Device } from '@capacitor/device';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, 
    private router: Router, private bdSvc: BdService,
    private dataInit: DataInitializationService) {
      this.log();
    }

  async log(){
    console.log(await Device.getInfo());
    console.log(await Device.getLanguageCode());
    console.log(await Device.getId());
  }

  async register(username: string, telephone: string, localite: string, password: string): Promise<any> {
    let phoneId = (await Device.getId()).identifier as string;
    let model = (await Device.getInfo()).model as string;
    let name = (await Device.getInfo()).name as string;
    let operatingSystem = (await Device.getInfo()).operatingSystem as string;
    return await firstValueFrom(this.http.post(`${this.apiUrl}/register`, { 
      username, 
      telephone, 
      password, 
      localite, 
      phoneId,
      model,
      name,
      operatingSystem
    }));
  }

  async login(telephone: string, password: string): Promise<any> {
    let phoneId = (await Device.getId()).identifier as string;
    return await firstValueFrom(this.http.post(`${this.apiUrl}/login`, { telephone, password, phoneId }));
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
    let activeUser = await this.bdSvc.getActiveUser()
    console.warn("voici l'utilisateur actif", activeUser);
    return !!activeUser
  }

  async initDatabase(): Promise<boolean>{
    return new Promise(async (resolve, reject) => {
      try {
        if(!this.bdSvc.dbIsready){
          await this.bdSvc.initDatabase();
        }
        resolve(true)
      } catch (error) {
        reject(false)
      }
    })
  }

  
}
