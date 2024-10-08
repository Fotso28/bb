import { ProduitsRavitailles } from "./ProduitsRavitailles";
import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('Ravitaillement')
export class Ravitaillement {
    public produits: string = "";
    public casiers: string = "";
    constructor(
      public id?: number,
      public date?: number,
    //   public produit_rav_liste?: ProduitsRavitailles[], // Liste des produits ravitailles
      public num_facture?: string,
      public id_fournisseur?: number,
      public nom_fournisseur?: string,
      public id_point_vente?: number,
      public total?: number,
      public dette?: number,
      public montant_verse?: number,
      public user_id?: number,
      public can_update?: boolean,
      public photo_facture_url?: string,
      public all_ready_inventoried?: boolean
    ) {
      this.all_ready_inventoried = false;
      this.can_update = true;
    }

     /***
     * Just for store list of  Casier
     */
    set _casier(casier: Custom_Casier_Model[]) {
        this.casiers = JSON.stringify(casier);
    }
    
    get _casier(): Custom_Casier_Model[] {
        return this.casiers ? JSON.parse(this.casiers) : null;
    }


    /***
     * Just for store list of  product
     */
    set _produit_rav_liste(liste_produit: ProduitsRavitailles[]) {
        if(liste_produit){
            this.produits = JSON.stringify(liste_produit);
        }else{
            this.produits = ''
        }
    }
    get _produit_rav_liste(): ProduitsRavitailles[] {
        if(this.produits){
            return JSON.parse(this.produits) ;
        }else{
            return [] as ProduitsRavitailles[] 
        }
    }

attributsDansObjet(source: any, cible: any): boolean {
    for (const key in source) {
        if (!(key in cible)) {
            return false;
          }
        }
        return true;
    }
}
// Definit pour enregistre les produit lors des manipulations


/**
 * Utiliser pour manipuler les casiers ENTRES et SORTIES
 */
export interface Custom_Casier_Model {
    id: number,
    nom: string,
    qte: number,
    transaction: TransactionType
}
export enum TransactionType {
    IN = 'IN',
    OUT = 'OUT',
    // Ajoutez d'autres valeurs au besoin
  }