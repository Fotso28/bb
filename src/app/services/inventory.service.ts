import { Injectable } from '@angular/core';
import { ProduitsRavitailles } from '../models/ProduitsRavitailles';
import { BdService } from './-bd.service';
import { Ravitaillement } from '../models/Ravitaillements';
import { Reste } from '../models/RestesModel';
import { Vente } from '../models/ProduitVendus';
import { showError } from '../_lib/lib';
import { User, UserService } from './user.service';
import { PointVenteService } from './point-vente.service';
import { PointVente } from '../models/PointVentes';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private vente!: Vente;
  public restes!: ProduitsRavitailles[];
  constructor(private bdSvc: BdService, private userSvc: UserService, private pointVenteSvc: PointVenteService) {
      
  }

  
  // setReste(restes: ProduitsRavitailles[]){
  //   this._restes = JSON.stringify(restes);
  // }
  // getRestes(): string{
  //   return this._restes;
  // }
   /**
   * 
   * @returns Promise<Ravitaillement[]>
   */
   async getUninventoryRavitaillements(): Promise<Ravitaillement[]>{
    let sql = 'SELECT * FROM Ravitaillement WHERE all_ready_inventoried = 0';
    return (await this.bdSvc.query(sql)).values as Ravitaillement[];
  }

  /**
   * return vente instance
   * @returns Vente
   * 
   */
  getInventoryInstance(): Vente{
    if(!this.vente){
      this.vente = new Vente();
    }
    return this.vente;
  }

  /**
   * 
   * @returns Promise<Reste[]>
   */
  async getLastStock(): Promise<Reste[]>{
    let sql = 'SELECT * FROM Reste WHERE id = (SELECT MAX(id) FROM Reste)';
    return (await this.bdSvc.query(sql)).values as Reste[];
  }

  async saveStock(reste: Reste){
    return  await this.bdSvc.create(reste);
  }
  async saveVente(vente: Vente){
    return  await this.bdSvc.create(vente);
  }

  async markAllAsRavitaille(){
    return await this.bdSvc.query('UPDATE Ravitaillement SET all_ready_inventoried = 1 WHERE all_ready_inventoried = 0')
  }

  sommeArrayProduits(arr: ProduitsRavitailles[][]): ProduitsRavitailles[] | false {
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
        return false;
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
  
    extractProductFromRavitaillement(arr: Array<Ravitaillement>): Array<ProduitsRavitailles[]> | false{ 
      try {
        let arr1: Array<ProduitsRavitailles[]> = [];
        arr.forEach((elt: Ravitaillement) => {
          arr1.push(JSON.parse(elt.produits) as Array<ProduitsRavitailles> );
        });
        return arr1;
      } catch (error) {
        showError(error)
        return [];
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

    

    // async saveProduitVendu(sommeProduitRavitailles: ProduitsRavitailles[], lastStockProduct: ProduitsRavitailles[], restes: ProduitsRavitailles[], ids_ravitaillement:  Array<number | undefined>): Promise<boolean>{
    //   try {
  
    //     if(ids_ravitaillement.every(val => val == undefined)){
    //       console.log("ravitaillement mal definie");
    //       showToast("ravitaillement mal definie", "danger");
    //       return false
    //     }
  
    //     console.log("Sommes ",sommeProduitRavitailles)
  
    //     if(!sommeProduitRavitailles.length){
    //       console.log("Aucun produit ravitaille");
    //       showToast("Aucun produit ravitaille", "danger");
    //       return false
    //     }
    
    //     let produitVendu: ProduitsRavitailles[] = []; 
    //     for(let i=0; i < this.produits.length; i++){
    //         let prod_ravitaille: ProduitsRavitailles = sommeProduitRavitailles.find(prod_r => this.produits[i].id == prod_r.id) || <ProduitsRavitailles>{};
    //         let lastSto: ProduitsRavitailles = lastStockProduct.length ? lastStockProduct.find(last_sto => this.produits[i].id == last_sto?.id) || <ProduitsRavitailles>{} : <ProduitsRavitailles>{};
    //         let reste: ProduitsRavitailles = restes.length ? restes.find(res => this.produits[i].id == res.id) || <ProduitsRavitailles>{} : <ProduitsRavitailles>{};
    //         let qte_vendu: number = 0;
  
    //         if(lastSto.qte_btle && isNaN(lastSto.qte_btle!)){
    //           console.log("produit mal defini  dans la table Reste", lastSto);
    //           showToast("produit mal defini", "danger");
    //           return false
    //         }
  
    //         if(lastSto.qte_btle){
    //           qte_vendu += lastSto.qte_btle
    //         }
  
    //         if(prod_ravitaille.qte_btle && isNaN(prod_ravitaille.qte_btle)){
    //           console.log("produit mal defini dans la table ravitaillement", prod_ravitaille);
    //           showToast("produit mal defini  dans la table ravitaillement", "danger");
    //           return false
    //         }
  
    //         if(prod_ravitaille.qte_btle){
    //           qte_vendu += prod_ravitaille.qte_btle
    //         }
  
    //         if(reste.qte_btle && isNaN(reste.qte_btle)){
    //           console.log("produit mal defini (reste)", reste);
    //           showToast("produit mal defini  (reste)", "danger");
    //           return false
    //         }
  
    //         if(reste.qte_btle){
    //           qte_vendu -= reste.qte_btle
    //         }
    
    //         let prod_v : ProduitsRavitailles = this.produits[i];
    //         prod_v.qte_btle = qte_vendu; 
    //         produitVendu.push(prod_v);
            
    //     };
  
    //     console.log("Les produits vendu sont : ",produitVendu)
    
        
    //     if(!this.pointVenteSvc.getActivePointeVente()?.id){
    //       console.log("Point de vente non defini");
    //       showToast("Point de vente non defini", "danger");
    //       return false
    //     }
        
    //     if(!this.userSvc.getActiveUser()?.id && this.userSvc.getActiveUser()?.id == undefined){
    //       console.log("User non defini");
    //       showToast("User non defini", "danger");
    //       return false
    //     }
    
    //     let vente: Vente = new Vente(
    //       (new Date()).getTime(),
    //       JSON.stringify(produitVendu)
    //     );
    //     vente.id_employe = 25;
    //     vente.id_point_vente = this.pointVenteSvc.getActivePointeVente()?.id!
    //     vente.ids_ravitaillement = JSON.stringify(ids_ravitaillement);
    //     let somme = this.sommePrix(produitVendu);
    //     if(somme == "Error"){
    //       showToast("Erreur avec la somme", "danger");
    //       return false;
    //     }
    //     vente.total = somme;
    //     vente.versement = 55;
        
    //     let isSaved: boolean = await this.ravSvc.saveVente(vente);
    //     return isSaved;
    //   } catch (error) {
    //     console.log(error);
    //     return false;
    //   }
    // }
    
   sommePrix(produits_ravitailles: ProduitsRavitailles[]): number | "Error" {
      try {
        return produits_ravitailles.reduce((somme, produit) =>{
          console.log("reste",(produit?.qte_btle! % produit.nbreBtleParCasier) * produit?.prixA! / produit.nbreBtleParCasier)
          console.log("Total div", Math.floor(produit?.qte_btle! / produit.nbreBtleParCasier) * produit.prixA)
          if(produit?.prixA && produit?.qte_btle){
            return somme + Math.floor( produit?.qte_btle / produit.nbreBtleParCasier) * produit?.prixA + produit?.qte_btle % produit.nbreBtleParCasier * produit?.prixA / produit.nbreBtleParCasier
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

  getVenteInstance(){
    if(!this.vente){
      this.vente = new Vente();
    }
    return this.vente;
  }
}



