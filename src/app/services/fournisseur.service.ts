import { Injectable } from '@angular/core';
import { Fournisseur } from '../models/Fournisseurs';
import { BehaviorSubject } from 'rxjs';
import { BdService } from './-bd.service';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  fournisseurSubject: BehaviorSubject<Fournisseur[]> = new BehaviorSubject<Fournisseur[]>([]);

  constructor(private bdSvc: BdService){}
  
  async create(item: Fournisseur): Promise<boolean> {
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

  async update(item: Fournisseur): Promise<boolean> {
    try {
      let itemIsUpdated: boolean = await this.bdSvc.update(item);
      if(itemIsUpdated) this.getAll();
      return itemIsUpdated;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  async delete(item: Fournisseur): Promise<boolean> {
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
      let all = await this.bdSvc.readAll('Fournisseur') as Array<Fournisseur>;
      this.fournisseurSubject.next(all);
      return true
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  hydrateFournisseur(item:any): Fournisseur{
    let fournisseur: Fournisseur = new Fournisseur(item.nom);
    if(item.id) fournisseur.id = item.id;

    
    if(item.adresse) fournisseur.adresse = item.adresse;
    if(item.phone1) fournisseur.phone1 = item.phone1;
    if(item.collecte_ristourne) fournisseur.collecte_ristourne = item.collecte_ristourne;
    if(item.photo) fournisseur.photo = item.photo;
    if(item.deletedAt) fournisseur.deletedAt = item.deletedAt;
    return fournisseur;
  }
}
