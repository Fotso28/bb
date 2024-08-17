import { Injectable } from '@angular/core';
import { Avaris } from '../models/Avaris';
import { BehaviorSubject } from 'rxjs';
import { BdService, NON_DELETE_VALUE } from './-bd.service';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { PointVente } from '../models/PointVentes';
import { PointVenteService } from './point-vente.service';
import { showError } from '../_lib/lib';

@Injectable({
  providedIn: 'root'
})
export class AvarisService {
  
  avarisSubject: BehaviorSubject<Avaris[]> = new BehaviorSubject<Avaris[]>([]);

  constructor(private bdSvc: BdService, private pointVenteSvc: PointVenteService){}
  
  async create(item: Avaris): Promise<boolean | DBSQLiteValues> {
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
      const sql = `SELECT Avaris.*, Produit.nom FROM Avaris JOIN Produit On Avaris.produit_id = Produit.id WHERE Avaris.deletedAt = 0`;
      let all = (await this.bdSvc.query(sql, true)).values as Array<Avaris>;
      // let all = await this.bdSvc.readAll('Avaris') as Array<Avaris>;
      this.avarisSubject.next(all);
      return true
    } catch (error) {
      console.log(error);
      return false;
    }
  }

    /**
   * Récupère la quantité totale d'avaris non inventoriés pour un produit spécifique dans le point de vente actif.
   * @param produit_id L'ID du produit dont on veut récupérer les avaris.
   * @returns Promise<number | false> La quantité totale d'avaris non inventoriés ou false en cas d'erreur.
   */
  async getAllUninventoryArarisPerProduct(produit_id: number): Promise<number | false> {
    try {
      // Récupère le point de vente actif
      let _pointVente: PointVente| null = this.pointVenteSvc.getActivePointeVente(); 
      // Vérifie si le point de vente est valide
      if(!_pointVente || !_pointVente.id){
        console.log("point de vente non initialisé");
        return false;
      }

      // Vérifie si l'ID du produit est défini
      if(!produit_id){
        console.log('ID non defini');
        return false;
      }

      // Construit la requête SQL pour récupérer la somme des quantités d'avaris non inventoriés
      const sql = `SELECT id, produit_id, point_vente_id, SUM(qte) AS total_quantity 
      FROM Avaris WHERE deletedAt = 0  AND point_vente_id = ${_pointVente.id}  
      AND all_ready_inventoried = 0 AND produit_id = ${produit_id}`;
      console.log(sql)
      // Exécute la requête SQL
      let all = (await this.bdSvc.query(sql, true)).values as Array<Avaris & {total_quantity: number}>;
      console.log(all);
      // Si aucun résultat n'est trouvé, retourne 0
      if(!all.length){
        return 0;
      }

      // Retourne la quantité totale d'avaris
      return all[0].total_quantity;
    } catch (error) {
      // Log l'erreur et retourne false en cas d'exception
      console.log(error);
      return false;
    }
  }

  async getAllUninventoryAvaris(): Promise<Array<Avaris> | false>{
    try {
      // Récupère le point de vente actif
      let _pointVente: PointVente| null = this.pointVenteSvc.getActivePointeVente(); 
      // Vérifie si le point de vente est valide
      if(!_pointVente || !_pointVente.id){
        console.log("point de vente non initialisé");
        return false;
      }

      // Construit la requête SQL pour récupérer la somme des quantités d'avaris non inventoriés
      const sql = `SELECT * FROM Avaris WHERE deletedAt = 0  AND point_vente_id = ${_pointVente.id}  
          AND all_ready_inventoried = 0`;

      // Exécute la requête SQL
      let all = (await this.bdSvc.query(sql)).values as Array<Avaris>;

      return all;
    } catch (error) {
      showError(error);
      return false;
    }
  }

  hydrateAvaris(item:any): Avaris{
    let avaris: Avaris = new Avaris();
    console.log(avaris);
    if(item.id) avaris.id = item.id;
    if(item.qte) avaris.qte = item.qte;
    if(item.produit_id) avaris.produit_id = item.produit_id;
    if(item.point_vente_id) avaris.point_vente_id = item.point_vente_id;
    if(item.user_id) avaris.user_id = item.user_id;
    if(item.description) avaris.description = item.description;
    if(item.date) avaris.date = item.date;
    if(item.updatedAt) avaris.updatedAt = item.updatedAt;
    if(item.createdAt) avaris.createdAt = item.createdAt;
    if(item.deletedAt) avaris.deletedAt = item.deletedAt;

    return avaris;
  }

  setAvarisIntoried(): boolean{
    try {
      let sql = "UPDATE Avaris SET all_ready_inventoried = 1, updatedAt = CURRENT_TIMESTAMP";
      this.bdSvc.query(sql);
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
