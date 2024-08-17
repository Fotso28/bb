import { Injectable } from '@angular/core';
import { PointVente } from '../models/PointVentes';
import { BdService } from './-bd.service';
import { BehaviorSubject } from 'rxjs';
import { DBSQLiteValues } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class PointVenteService {
    // Exemple de liste de familles (peut être remplacé par une API ou une base de données)

    pointVenteSubject: BehaviorSubject<PointVente[]> = new BehaviorSubject<PointVente[]>([]);

    constructor(private bdSvc: BdService){}
    
    async create(item: PointVente): Promise<boolean | DBSQLiteValues> {
      try {
          let itemsIsReaded = await this.bdSvc.create(item);
          if(itemsIsReaded) this.getAll();
          return itemsIsReaded;
        } catch (error) {
          console.log(error);
          return false;
      }
    }
  
    async read(id: number): Promise<boolean> {
      try {
        let itemIsReaded: boolean = await this.bdSvc.read('PointVente',id);
        if(itemIsReaded) this.getAll();
        return itemIsReaded;
      } catch (error) {
        console.log(error);
        return false
      }
    }
  
    async update(item: PointVente): Promise<boolean> {
      try {
        let itemIsUpdated: boolean = await this.bdSvc.update(item);
        if(itemIsUpdated) this.getAll();
        return itemIsUpdated;
      } catch (error) {
        console.log(error);
        return false
      }
    }
  
    async delete(item: PointVente): Promise<boolean> {
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
      try {
        let all = await this.bdSvc.readAll('PointVente') as Array<PointVente>;
        this.pointVenteSubject.next(all);
        return true
      } catch (error) {
        console.log(error);
        return true;
      }
    }

    async all(): Promise<Array<PointVente>> {
      try {
        return await this.bdSvc.readAll('PointVente') as Array<PointVente>;
      } catch (error) {
        console.log(error);
        return [];
      }
    }

    hydratePointVente(item:any): PointVente{
      let pointVente: PointVente = new PointVente(item.nom);
      
      if(item.id) pointVente.id = item.id;
      if(item.description) pointVente.description = item.description;
      if(item.adresse) pointVente.adresse = item.adresse;
      if(item.deletedAt) pointVente.deletedAt = item.deletedAt;
      return pointVente;
    }

    /***
     * Set a pointVente as active
     * @param PointVente
     */
    setActivePointVente(pointVente: PointVente):void{
      localStorage.setItem('pointVente',JSON.stringify(pointVente));
    }
    /**
     * Get active pointVente
     * @return PointVente | null
     */
    getActivePointeVente(): PointVente | null{
      let pointVente = localStorage.getItem('pointVente');
      if(!pointVente){
        return null
      }else{
        return JSON.parse(pointVente);
      }
    }

    
}
