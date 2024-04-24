import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BdService } from './-bd.service';
import { Depense } from '../models/Depenses';

@Injectable({
  providedIn: 'root'
})
export class DepenseService {

  depenseSubject: BehaviorSubject<Depense[]> = new BehaviorSubject<Depense[]>([]);

  constructor(private bdSvc: BdService){}
  
  async create(item: Depense): Promise<boolean> {
    try {
        let itemsIsReaded = await this.bdSvc.create(item);
        if(itemsIsReaded) this.getAll();
        return itemsIsReaded;
      } catch (error) {
        console.log(error);
        return false;
    }
  }

  async getTypeDepense(): Promise<Array<any>>{
    return await this.bdSvc.readAll("Categorie", ` AND type = 'depense'`);
  }


  async update(item: Depense): Promise<boolean> {
    try {
      let itemIsUpdated: boolean = await this.bdSvc.update(item);
      if(itemIsUpdated) this.getAll();
      return itemIsUpdated;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  async delete(item: Depense): Promise<boolean> {
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
      const sql = `SELECT Depense.id, Depense.date,  Depense.type, Depense.motif, Depense.montant, Depense.user_id, Depense.point_vente_id, PointVente.nom
       FROM Depense 
       JOIN PointVente On Depense.point_vente_id = PointVente.id`;
      let all = (await this.bdSvc.query(sql, true)).values as Array<Depense>;
      // let all = await this.bdSvc.readAll('Depense') as Array<Depense>;
      this.depenseSubject.next(all);
      return true
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  hydrateDepense(item:any): Depense{
    
    let depense: Depense = new Depense();

    if(item.id) depense.id = item.id;
    if(item.date) depense.date = item.date;
    if(item.type) depense.type = item.type;
    if(item.motif) depense.motif = item.motif;
    if(item.montant) depense.montant = item.montant;
    if(item.point_vente_id) depense.point_vente_id = item.point_vente_id;
    if(item.user_id) depense.user_id = item.user_id;
    if(item.deletedAt) depense.deletedAt = item.deletedAt;

    return depense;
  }
}
