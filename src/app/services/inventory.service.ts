import { Injectable } from '@angular/core';
import { ProduitsRavitailles } from '../models/ProduitsRavitailles';
import { BdService } from './-bd.service';
import { Ravitaillement } from '../models/Ravitaillements';
import { Reste } from '../models/RestesModel';
import { Vente } from '../models/ProduitVendus';
import { showError, showToast } from '../_lib/lib';
import { User, UserService } from './user.service';
import { PointVenteService } from './point-vente.service';
import { PointVente } from '../models/PointVentes';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private ventes!: Vente;

  public restes!: ProduitsRavitailles[];

  public lastStockProduct!: ProduitsRavitailles[];
  public somProduitVendu!: ProduitsRavitailles[];
  public montantTotalVendu!: number;

  public produits: ProduitsRavitailles[] = [];

  ids_ravitaillement!:  Array<number | undefined>
  constructor(private bdSvc: BdService, private userSvc: UserService, private pointVenteSvc: PointVenteService) {
      
  }

   /**
   * 
   * @returns Promise<Ravitaillement[]>
   */
   async getUninventoryRavitaillements(): Promise<Ravitaillement[] |false>{
    try {
      let sql = 'SELECT * FROM Ravitaillement WHERE all_ready_inventoried = 0';
      let _rav = await this.bdSvc.query(sql)
      if(!_rav){
        return false
      }
      return _rav.values as Ravitaillement[];
    } catch (error) {
      console.log(error);
      return false
    }
  }

  /**
   * return vente instance
   * @returns Vente
   * 
   */
  getInventoryInstance(): Vente{
    if(!this.ventes){
      this.ventes = new Vente();
    }
    return this.ventes;
  }

  /**
   * 
   * @returns Promise<Reste[]>
   */
  async getLastStock(): Promise<Reste[] | false>{
    try {
      let sql = 'SELECT * FROM Reste WHERE id = (SELECT MAX(id) FROM Reste)';
      let _reste = await this.bdSvc.query(sql)
      return _reste.values as Reste[];
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async saveStock(reste: Reste){
    return  await this.bdSvc.create(reste);
  }
  async saveVente(vente: Vente): Promise<boolean>{
    return  await this.bdSvc.create(vente);
  }

  async markAllAsRavitaille(){
    return await this.bdSvc.query('UPDATE Ravitaillement SET all_ready_inventoried = 1 WHERE all_ready_inventoried = 0')
  }

  sommeArrayProduits(arr: ProduitsRavitailles[][]): ProduitsRavitailles[] {
      try {
        const productMap: { [id: number]: ProduitsRavitailles } = {};
        arr.forEach(subArray => {
          subArray.forEach(product => {
            const { id, qte_btle, ...rest } = product;
            if (id && productMap[id]  && qte_btle != undefined) {
              productMap[id].qte_btle! += qte_btle;
            } else {
              productMap[id] = { id, qte_btle, ...rest };
            }
          });
        });
        return Object.values(productMap);
      } catch (error) {
        showError(error)
        return [];
      }
    }
  
    async getRavitaillements():Promise<Ravitaillement[] | false>{
      try {
        return await this.getUninventoryRavitaillements();
      } catch (error) {
        showError(error)
        return false;
      }
    }
  
    extractProductFromRavitaillement(arr: Array<Ravitaillement>): Array<ProduitsRavitailles[]>| false{ 
      try {
        let arr1: Array<ProduitsRavitailles[]> = [];
        arr.forEach((elt: Ravitaillement) => {
          arr1.push(JSON.parse(elt.produits) as Array<ProduitsRavitailles> );
        });
        return arr1;
      } catch (error) {
        showError(error)
        return false;
      }
    }
  
    async saveReste(reste: Reste): Promise<boolean>{
      try {
        return await this.saveStock(reste)
      } catch (error) {
        showError(error)
        return false;
      }
    }
  
    /**
     * Enregistrer les restes courant
     */
    async saveCurrentStock(restes: ProduitsRavitailles[]){
      
        try {
          let currentUser: User | null = this.userSvc.getActiveUser();
          let currentPointVente: PointVente | null = this.pointVenteSvc.getActivePointeVente();
          
          
          if(!currentUser){
            console.log("user undifined");
            return 
          }
  
          if(!currentPointVente){
            console.log("pointVente undifined");
            return 
          }
  
          let timestamp: number = (new Date).getTime();
          let restes_string: string = JSON.stringify(restes);
          let newReste: Reste = new Reste(timestamp, restes_string, currentUser.id, currentPointVente.id!); 
          
          return await this.saveReste(newReste);
          // Envoyer les données au service ou effectuer d'autres actions
        } catch (error) {
          showError(error)
          return false;
        }
      
    }
    /**
     * return list of product sold
     * @param sommeProduitRavitailles 
     * @param lastStockProduct 
     * @param restes 
     * @returns 
     */
    sommeProduitVendu(sommeProduitRavitailles: ProduitsRavitailles[], lastStockProduct: ProduitsRavitailles[], restes: ProduitsRavitailles[]){
      
      try {

        if(!Array.isArray(sommeProduitRavitailles) || !Array.isArray(lastStockProduct) || !Array.isArray(lastStockProduct)){
          console.log("Erreur");
          showToast("Aucun produit ravitaille", "danger");
          return
        }

        if(!sommeProduitRavitailles.length && !lastStockProduct.length && !lastStockProduct.length){
          console.log("Erreur");
          showToast("Aucun produit ravitaille", "danger");
          return
        }
    
        let produitVendu: ProduitsRavitailles[] = [];
        let produits = [...this.produits];

        for(let i=0; i < produits.length; i++){
          let prod_ravitaille: ProduitsRavitailles = Array.isArray(sommeProduitRavitailles) && sommeProduitRavitailles.find(prod_r => produits[i].id == prod_r.id) || <ProduitsRavitailles>{};
          let lastSto: ProduitsRavitailles = Array.isArray(lastStockProduct) && lastStockProduct.length ? lastStockProduct.find(last_sto => produits[i].id == last_sto?.id) || <ProduitsRavitailles>{} : <ProduitsRavitailles>{};
          let reste: ProduitsRavitailles = Array.isArray(restes) && restes.length ? restes.find(res => produits[i].id == res.id) || <ProduitsRavitailles>{} : <ProduitsRavitailles>{};
          let qte_btle : number = 0;

          if(lastSto.qte_btle && isNaN(lastSto.qte_btle!)){
            console.log("produit mal defini  dans la table Reste", lastSto);
            showToast("produit mal defini", "danger");
            return false
          }

          if(lastSto.qte_btle){
            qte_btle += lastSto.qte_btle
          }

          if(prod_ravitaille.qte_btle && isNaN(prod_ravitaille.qte_btle)){
            console.log("produit mal defini dans la table ravitaillement", prod_ravitaille);
            showToast("produit mal defini  dans la table ravitaillement", "danger");
            return false
          }

          if(prod_ravitaille.qte_btle){
            qte_btle += prod_ravitaille.qte_btle
          }

          if(reste.qte_btle && isNaN(reste.qte_btle)){
            console.log("produit mal defini (reste)", reste);
            showToast("produit mal defini  (reste)", "danger");
            return false
          }
          

          if(reste.qte_btle){
            qte_btle -= reste.qte_btle
          }
          // Creating a new instance of ProduitsRavitailles to avoid modifying the original objects
          let prod_v = new ProduitsRavitailles(
            produits[i].id,
            produits[i].prixA,
            produits[i].prixV,
            produits[i].nbreBtleParCasier,
            produits[i].nom,
            qte_btle, // setting the calculated quantity sold
            produits[i].ristourne,
            produits[i].famille,
            produits[i].categorie,
            produits[i].fournisseurs
          );
          // Ceci ressemble à une ligne redondante mais il n'est est pas.
          // à cause du Hoisting
          prod_v.qte_btle = qte_btle;
          produitVendu.push(prod_v);
            
        };
  
        console.log("Les produits vendu sont : ",produitVendu)
        return produitVendu;
      } catch (error) {
        console.log(error);
        return false;
      }
    }

    async saveProduitVendu( vente: Vente): Promise<boolean>{
      try {
        let isSaved: boolean = await this.saveVente(vente);
        return isSaved;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    
   sommePrix(produits_ravitailles: ProduitsRavitailles[]): number | "Error" {
      try {
        return produits_ravitailles.reduce((somme, produit) =>{
          
          if(produit?.prixA && produit?.qte_btle){
            return somme + Math.floor( produit?.qte_btle / produit.nbreBtleParCasier) * produit?.prixV + produit?.qte_btle % produit.nbreBtleParCasier * produit?.prixV / produit.nbreBtleParCasier
          }else{
            return somme
          }
        }, 0);
      } catch (error) {
        return "Error"
      }
  }

  async getInventory(){
    return (await this.bdSvc.query('Select * FROM Vente')) ;
  }

  /**
   * Take an array of ProduitsRavitailles return true if it is not empty or false if empty
   * @param prod: ProduitsRavitailles[]
   * @returns boolean
   */
  isNotEmpty(prod: ProduitsRavitailles[]):boolean{
    if(!Array.isArray(prod) || !prod.length){
      return false;
    }
    
    if(prod.every((p: ProduitsRavitailles) => !p.qte_btle)){
      return false
    }
    return true;
  }
}



