import { Injectable } from '@angular/core';
import { Famille } from '../models/Familles';
import { ICrud } from '../Interfaces/Crud';
import { BdService } from './-bd.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilleService implements ICrud<Famille>{
    // Exemple de liste de familles (peut être remplacé par une API ou une base de données)

    familleSubject: BehaviorSubject<Famille[]> = new BehaviorSubject<Famille[]>([]);

    constructor(private bdSvc: BdService){}
    
    async create(item: Famille): Promise<boolean> {
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
        let itemIsReaded: boolean = await this.bdSvc.read('Famille',id);
        if(itemIsReaded) this.getAll();
        return itemIsReaded;
      } catch (error) {
        console.log(error);
        return false
      }
    }
  
    async update(item: Famille): Promise<boolean> {
      try {
        let itemIsUpdated: boolean = await this.bdSvc.update(item);
        if(itemIsUpdated) this.getAll();
        return itemIsUpdated;
      } catch (error) {
        console.log(error);
        return false
      }
    }
  
    async delete(item: Famille): Promise<boolean> {
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
        let all = await this.bdSvc.readAll('Famille') as Array<Famille>;
        this.familleSubject.next(all);
        return true
      } catch (error) {
        console.log(error);
        return true;
      }
    }

    hydrateFamille(item:any): Famille{
      let famille: Famille = new Famille(item.nom);
      
      if(item.id) famille.id = item.id;
      if(item.description) famille.description = item.description;
      if(item.deletedAt) famille.deletedAt = item.deletedAt;
      return famille;
    }
}
