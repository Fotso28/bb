import { Injectable } from '@angular/core';
import { Avaris } from '../models/Avaris';
import { BehaviorSubject } from 'rxjs';
import { BdService, NON_DELETE_VALUE } from './-bd.service';

@Injectable({
  providedIn: 'root'
})
export class AvarisService {
  
  avarisSubject: BehaviorSubject<Avaris[]> = new BehaviorSubject<Avaris[]>([]);

  constructor(private bdSvc: BdService){}
  
  async create(item: Avaris): Promise<boolean> {
    try {
        let itemsIsReaded = await this.bdSvc.create(item);
        if(itemsIsReaded) this.getAll();
        return itemsIsReaded;
      } catch (error) {
        console.log(error);
        return false;
    }
  }

  async getProduit(): Promise<Array<any>>{
    return await this.bdSvc.readAll("Produit");
  }


  async update(item: Avaris): Promise<boolean> {
    try {
      let itemIsUpdated: boolean = await this.bdSvc.update(item);
      if(itemIsUpdated) this.getAll();
      return itemIsUpdated;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  async delete(item: Avaris): Promise<boolean> {
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
      const sql = `SELECT Avaris.id, Avaris.produit_id, Produit.nom, Avaris.date, Avaris.qte FROM Avaris JOIN Produit On Avaris.produit_id = Produit.id`
      let all = (await this.bdSvc.query(sql, true)).values as Array<Avaris>;
      // let all = await this.bdSvc.readAll('Avaris') as Array<Avaris>;
      this.avarisSubject.next(all);
      return true
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  hydrateAvaris(item:any): Avaris{
    
    let avaris: Avaris = new Avaris();

    if(item.id) avaris.id = item.id;
    if(item.qte) avaris.qte = item.qte;
    if(item.produit_id) avaris.produit_id = item.produit_id;
    if(item.point_vente_id) avaris.point_vente_id = item.point_vente_id;
    if(item.user_id) avaris.user_id = item.user_id;
    if(item.description) avaris.description = item.description;
    if(item.date) avaris.date = item.date;
    if(item.updatedAt) avaris.updatedAt = item.updatedAt;
    if(item.createdAt) avaris.createdAt = item.createdAt;

    return avaris;
  }
}
