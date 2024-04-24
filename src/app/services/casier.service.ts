import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Casier } from '../models/Casiers';
import { BdService } from './-bd.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CasierService {
    // Exemple de liste de familles (peut être remplacé par une API ou une base de données)

    casierSubject: BehaviorSubject<Casier[]> = new BehaviorSubject<Casier[]>([]);

    constructor(private bdSvc: BdService, private platform: Platform){}

    isMobile(): boolean{
      return this.platform.is('capacitor')
    }
    
    async create(item: Casier): Promise<boolean> {

      if(!this.isMobile()){
        return false
      }
      
      try {
          let itemsIsReaded = await this.bdSvc.create(item);
          if(itemsIsReaded) this.getAll();
          return itemsIsReaded;
        } catch (error) {
          console.log(error);
          return false;
      }
    }
  
    async read(id: number): Promise<Casier | false> {

      if(!this.isMobile()){
        return false
      }

      try {
        if(!id) throw Error("vous n'avez pas defini l'ID")
        let itemIsReaded: Casier = await this.bdSvc.read('Casier',id);
        // if(itemIsReaded) this.getAll();
        return itemIsReaded;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  
    async update(item: Casier): Promise<boolean> {
      if(!this.isMobile()){
        return false
      }
      try {
        let itemIsUpdated: boolean = await this.bdSvc.update(item);
        if(itemIsUpdated) this.getAll();
        return itemIsUpdated;
      } catch (error) {
        console.log(error);
        return false
      }
    }
  
    async delete(item: Casier): Promise<boolean> {

      if(!this.isMobile()){
        return false
      }
      try {
        let itemIsDeleted: boolean = await this.bdSvc.delete(item);
        if(itemIsDeleted) this.getAll();
        return itemIsDeleted;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  
    async getAll(): Promise<boolean> {
      if(!this.isMobile()){
        return false
      }
      try {
        let all = await this.bdSvc.readAll('Casier') as Array<Casier>;
        this.casierSubject.next(all);
        return true
      } catch (error) {
        console.log(error);
        return true;
      }
    }

    hydrateCasier(item:any): Casier{
      let casier: Casier = new Casier(item.nom);
      casier.nbre_btle_par_casier = item.nbre_btle_par_casier;
      if(item.id) casier.id = item.id;
      if(item.description) casier.description = item.description;
      if(item.deletedAt) casier.deletedAt = item.deletedAt;
      return casier;
    }
}
