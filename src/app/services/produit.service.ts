import { Injectable } from '@angular/core';
import { Produit } from '../models/Produits';
import { BehaviorSubject } from 'rxjs';
import { BdService } from './-bd.service';
import { UserService } from './user.service';
import { ProduitsRavitailles } from '../models/ProduitsRavitailles';
import { DBSQLiteValues } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  produitSubject: BehaviorSubject<Produit[]> = new BehaviorSubject<Produit[]>([]);

  constructor(private bdSvc: BdService, private userSvc: UserService){}
  
  async create(item: Produit): Promise<boolean> {
    try {
        if(!item.user_id) throw new Error("None of the users are defined");

        console.log("dans le service produit, voici la valeur du produit", item)
        let itemsIsReaded = await this.bdSvc.create(item);
        if(itemsIsReaded) this.getAll();
        return itemsIsReaded;
      } catch (error) {
        console.log(error);
        return false;
    }
  }

  async getFamilles(): Promise<Array<any>>{
    return await this.bdSvc.readAll("Famille");
  }

  async getCategorie(): Promise<Array<any>>{
    return await this.bdSvc.readAll("Categorie", "AND type = 'produit'");
  }

  async getCasier(): Promise<Array<any>>{
    return await this.bdSvc.readAll("Casier");
  }

  async getFournisseur(): Promise<Array<any>>{
    return await this.bdSvc.readAll("Fournisseur");
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

  async update(item: Produit): Promise<boolean> {
    try {

      item.user_id = this.userSvc.getActiveUser()?.id;
      if(!item.user_id) throw new Error("None of the users are defined");

      let itemIsUpdated: boolean = await this.bdSvc.update(item);
      if(itemIsUpdated) this.getAll();
      return itemIsUpdated;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  async delete(item: Produit): Promise<boolean> {
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
      let produits =  await this.bdSvc.readAll('Produit') as Array<Produit>;
      if(produits.length){
        this.produitSubject.next(produits);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getProduitRavitaillesList(): Promise<ProduitsRavitailles[]>{
    let produitRavitailles:  DBSQLiteValues = await this.bdSvc.query("select Produit.id, Produit.qte as qte_btle,Produit.ristourne,Produit.nbreBtleParCasier, Produit.prixV, Produit.prixA, Produit.nom as nom, Categorie.nom as categorie, Famille.nom as famille from Produit inner join Categorie, Famille on Produit.id_categorie = Categorie.id AND Produit.id_famille = Famille.id");
    
    return produitRavitailles?.values as ProduitsRavitailles[];
  }


  initProduitValues(memo:any): Produit{
    // console.log(memo); return {} as Produit;
    let produit = new Produit(memo.nom);
    produit.id = memo.id;
    produit.prixA = memo.prixA;
    produit.prixV = memo.prixV;
    produit.nbreBtleParCasier = memo.nbreBtleParCasier;
    produit.ristourne = memo.ristourne;
    produit.id_categorie = memo.id_categorie;
    produit.id_famille = memo.id_famille;
    produit.id_casier = memo.id_casier;
    produit.upload = memo.upload;
    produit.imgLink = memo.imgLink;
    produit.user_id = memo.user_id;
    produit.hasCasier = memo.hasCasier;
    produit.upload = memo.upload;
    produit._fournisseurs = Object.keys(memo).includes('fournisseurs') ? JSON.parse(memo.fournisseurs) : ( Object.keys(memo).includes('_fournisseurs_ids') ? memo._fournisseurs_ids : [] );
    produit.user_id = this.userSvc.getActiveUser()?.id;
    console.log(produit)
    return produit;
  }
}
