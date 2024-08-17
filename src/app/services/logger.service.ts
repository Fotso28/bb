// src/app/services/logger.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message1: any, message2: any = "") {
    if (!environment.production) {
      if(message2){
        console.log(message1, message2);
      }else{
        console.log(message1);
      }
    }
  }

  error(message1: any, message2: any = "") {
    if (!environment.production) {
      if(message2){
        console.error(message1, message2);
      }else{
        console.error(message1);
      }
    }
  }

  warn(message1: any, message2: any = "") {
    if (!environment.production) {
      if(message2){
        console.warn(message1, message2);
      }else{
        console.warn(message1);
      }
    }
  }
}

