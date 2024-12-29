import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  constructor(private httpClient: HttpClient) {}
  
  async getHeaders(activeUser: any){
    if(!activeUser || !activeUser.token){
      throw Error("L'utilisateur n'est mal defini");
    }
    return new HttpHeaders({
      "Content-Type": "application/json",
      "authorization" : "Bearer " +  activeUser.token
    });
  }
  async post(endpoint: string, data: any, activeUser: any): Promise<any>{
    let headers = await this.getHeaders(activeUser);
    return firstValueFrom(this.httpClient.post(environment.apiUrl + endpoint, data, { headers }));
  }
}
