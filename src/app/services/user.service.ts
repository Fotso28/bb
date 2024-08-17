import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(){}

    /***
   * Set a User as active
   * @param User
   */
  setActiveUser(user: User):void{
    localStorage.setItem('user',JSON.stringify(user));
    console.log('utilisateur créé');
  }
  /**
   * Get active User
   * @return User | null
   */
  getActiveUser(): User | null{
    try {
      let user = localStorage.getItem('user');
      if(!user){
        return null
      }else{
        return JSON.parse(user);
      }
    } catch (error) {
      return null;
    }
  }
}

export interface User {
  id: number;
  username: string;
  telephone: string;
  localite: string;
  token: string
}