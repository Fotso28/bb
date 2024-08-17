import { Component, OnInit } from '@angular/core';
import { getDate, sommeArrayProduits } from 'src/app/_lib/lib';
import { Vente } from 'src/app/models/ProduitVendus';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { Reste } from 'src/app/models/RestesModel';
import { EmployeService } from 'src/app/services/employe.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.page.html',
  styleUrls: ['./view-inventory.page.scss'],
})
export class ViewInventoryPage implements OnInit {
 
  employes: any;
  vente!: Vente;
  sommeProduitRavitaille: ProduitsRavitailles[] = [];
  lastproductsStock: ProduitsRavitailles[] = [];

  dateState: Counter[] = [];
  //   arr: ProduitsRavitailles[] = [
  //     { id: 1, qte_btle: 12, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "tara" },
  //     { id: 2, qte_btle: 5, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "Toro" },
  //     { id: 4, qte_btle: 10, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "Alida" },
  // ];

  // arr1: ProduitsRavitailles[] = [
  //     { id: 3, qte_btle: 10, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "matter" },
  //     { id: 5, qte_btle: 5, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "Kamga" },
  //     { id: 6, qte_btle: 10, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "Toro123" },
  // ];

  // arr2: ProduitsRavitailles[] = [
  //     { id: 1, qte_btle: 10, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "tara" },
  //     { id: 2, qte_btle: 20, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "Toro" },
  //     { id: 5, qte_btle: 25, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "Kamga" },
  //     { id: 6, qte_btle: 5, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "Toro123" },
  //     { id: 7, qte_btle: 13, prixA: 500, prixV: 800, nbreBtleParCasier: 12, nom: "Great" },
  // ];
  constructor(public inventorySvc: InventoryService,public emplSvc: EmployeService, public ravSvc: RavitaillementService) { }

  async ngOnInit() {
    try {
      this.vente = history.state as Vente;
      if(!Object.keys(this.vente).includes('id')){
        throw new Error("une erreur est survenue");
      }
      console.log(this.employes, this.vente)
      let ids_employe: Array<number> = JSON.parse(this.vente.ids_employe);
      this.employes = await this.emplSvc.getById(ids_employe);
      console.log(this.employes, "lejfkdjk")
      // Retrieve and calculate produit ravitailles
      let _rav_ids : Array<number> = JSON.parse(this.vente.ids_ravitaillement);
      console.log("les identifiants sont", _rav_ids);
      //Retrieve products
      let _all_ravs : Ravitaillement[] = [];
      if(_rav_ids.length){
          _all_ravs = await this.ravSvc.getRavitaillement(_rav_ids);
      }
  
      console.log("les ravitaillements sont: ", _all_ravs);
      //Parse Products
      let produit_ravitaille: ProduitsRavitailles[][] = [];
      if(_all_ravs.length){
        _all_ravs.forEach((rav: Ravitaillement)=>{
          produit_ravitaille.push((JSON.parse(rav.produits) as ProduitsRavitailles[]));
        })
      }
      // Somme all Products
     this.sommeProduitRavitaille = sommeArrayProduits(produit_ravitaille);
      console.log('la somme est :', this.sommeProduitRavitaille);
      
      // retrieve lastStock products
      let lastStock: Reste = <Reste>{};
      if(this.vente.id_lastStock){
        lastStock = await this.inventorySvc.getReste(this.vente.id_lastStock);
        this.lastproductsStock = JSON.parse(lastStock.produits) as ProduitsRavitailles[]
      }
  
      console.log("Last stock", lastStock.produits)
      console.log("vente ", this.vente?.produits!)
      this.dateState = this.mergeArrays(JSON.parse(lastStock?.produits ?? "[]"), this.sommeProduitRavitaille, JSON.parse(this.vente?.produits! ?? "[]"))
      console.log('elt', this.dateState)
    } catch (error) {
      console.log(error)
    }

    // console.log(this.mergeArrays(this.arr, this.arr1, this.arr2))
  }

  getDate():false | string{
    if(this.vente.date){
      return getDate(this.vente?.date)
    }
    return false;
  }

  getProduitVendu(): ProduitsRavitailles[]{
    if(this.vente.produits){
      return JSON.parse(this.vente.produits)
    }
    return []
  }

  /**
   * Tous les elements d'un ravitaillement et Inventaire
   * @param lastStocks 
   * @param ravitaillements 
   * @param ventes 
   * @returns 
   */
  mergeArrays(lastStocks: ProduitsRavitailles[], ravitaillements: ProduitsRavitailles[], ventes: ProduitsRavitailles[]): Counter[] {
    const resultMap: { [id: number]: { [key: string]: number|string } } = {};

    function updateResultMap( id: number, nom: string, prixV: number, prixA: number,  nbreBtleParCasier: number, source: string, value: number): void {
        if (!resultMap[id]) {
            resultMap[id] = { lastStock: 0, nom: nom, prixV: prixV, prixA: prixA, nbreBtleParCasier: nbreBtleParCasier, ravitaillement: 0,  vente: 0 };
        }
        resultMap[id][source] = value;
    }

    lastStocks.forEach(item => updateResultMap( item.id, item.nom, item.prixV, item.prixA, item.nbreBtleParCasier, 'lastStock', item.qte_btle || 0));
    ravitaillements.forEach(item => updateResultMap( item.id, item.nom, item.prixV, item.prixA, item.nbreBtleParCasier, 'ravitaillement', item.qte_btle || 0));
    ventes.forEach(item => updateResultMap( item.id, item.nom, item.prixV, item.prixA, item.nbreBtleParCasier, 'vente', item.qte_btle || 0));

    return Object.keys(resultMap).map(id => ({ id: parseInt(id), ...resultMap[parseInt(id)]})) as Counter[];
  }

  arround(int:number): number{
    return Math.floor(int);
  }
}

interface Counter{id:number, nom: string, prixV: number, prixA: number, nbreBtleParCasier: number, lastStock: number, ravitaillement: number, vente: number}
