import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(){}

  
}

export interface User {
  id: number;
  username: string;
  telephone: string;
  localite: string;
  token: string;
  phoneId: string; // Identifiant unique du téléphone de l'utilisateur
  appVersion: string; // Version de l'application que l'utilisateur utilise
  appExpirationDate: number; // Date d'expiration de l'application pour cet utilisateur
  isAppObsolete: boolean; // Indicateur si l'application est obsolète pour cet utilisateur
  abonnementPaymentDate: number; // Date du dernier paiement de l'abonnement
  abonnementActivationCode: string; // Code d'activation de l'abonnement
}