import { Injectable } from '@angular/core';
import { Categorie } from '../models/Categories';
import { BdService } from './-bd.service';
import { BehaviorSubject } from 'rxjs';
import { DBSQLiteValues } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  categorieSubject: BehaviorSubject<Categorie[]> = new BehaviorSubject<Categorie[]>([]);

    constructor(private bdSvc: BdService){}
    
    async create(item: Categorie): Promise<boolean | DBSQLiteValues> {
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
  
    async update(item: Categorie): Promise<boolean> {
      try {
        let itemIsUpdated: boolean = await this.bdSvc.update(item);
        if(itemIsUpdated) this.getAll();
        return itemIsUpdated;
      } catch (error) {
        console.log(error);
        return false
      }
    }
  
    async delete(item: Categorie): Promise<boolean> {
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
        let all = await this.bdSvc.readAll('Categorie') as Array<Categorie>;
        this.categorieSubject.next(all);
        return true
      } catch (error) {
        console.log(error);
        return true;
      }
    }

    hydrateCategorie(item:any): Categorie{
      let categorie: Categorie = new Categorie(item.nom);
      if(item.id) categorie.id = item.id;
      if(item.description) categorie.description = item.description;
      if(item.type) categorie.type = item.type;
      if(item.deletedAt) categorie.deletedAt = item.deletedAt;
      return categorie;
    }
}
