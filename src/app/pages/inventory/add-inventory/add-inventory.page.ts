import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { showError, showToast } from 'src/app/_lib/lib';
import { PointVente } from 'src/app/models/PointVentes';
import { Vente } from 'src/app/models/ProduitVendus';
import { Produit } from 'src/app/models/Produits';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { Reste } from 'src/app/models/RestesModel';
import { InventoryService } from 'src/app/services/inventory.service';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { ProduitService } from 'src/app/services/produit.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.page.html',
  styleUrls: ['./add-inventory.page.scss'],
})
export class AddInventoryPage implements OnInit {

  productForm!: FormGroup;
  produits: ProduitsRavitailles[] = [];

  prodRav: ProduitsRavitailles[][] = [];
  constructor(private formBuilder: FormBuilder, private router: Router, private productSvc: ProduitService, private inventorySvc: InventoryService ) {
    
  }

  async ngOnInit() {
  
    this.produits = await this.productSvc.getProduitRavitaillesList();

    this.inventorySvc.produits = this.produits;
    this.buildForm();
  }


  buildForm() {
    if(this.produits && this.produits.length > 0){
      const formControls = this.produits.map(product =>  new FormControl(0, [Validators.required, Validators.min(0), Validators.max(99999)]));
      this.productForm = this.formBuilder.group({ quantities: new FormArray(formControls) });
    }
  }

  getQuantityControl(index: number) {
    return ((this.productForm.get('quantities') as FormArray).controls[index] as FormControl<any>);
  }

  async onSubmit() {
    
    try {
      if(this.productForm.invalid){
        showToast("Formulaire incorrect", "danger");
        (this.productForm.get('quantities') as FormArray).markAllAsTouched();
        return;
      }
  
      const quantities = this.productForm.value.quantities;
      let produits = this.produits.slice()
      let restes: ProduitsRavitailles[] | false = this.combineProductsAndValues(produits, quantities);
      
      if(!restes){
        showToast("Erreur avec function restes()", "danger");
        console.log("Erreur avec function restes()")
        return;
      }
        
      this.inventorySvc.restes = restes;
      
      let isInit: boolean = await this.initSomeInventoriesValues();
      if(!isInit){
        return 
      }
      this.router.navigateByUrl("/more-detail");
    } catch (error) {
      console.log(error);
    }
  }
   /***
   * Recupere les valeurs dans le formulaire auto generee et le mets dans la variable de classe
   * this.produits
   */
   private combineProductsAndValues(products: ProduitsRavitailles[], values: number[]): ProduitsRavitailles[] | false {
    try {
      if (products.length !== values.length) {
        throw new Error('Les tableaux products et values doivent avoir la même longueur.');
      }
      if(!values.every(val => typeof val === 'number')){
        throw new Error("values error");
      }
      return Array.from(products, (product, i) => {
        product.qte_btle = values[i];
        return  product;
      });
    } catch (error) {
      showError(error)
      return false;
    }
  }
  /**
   * @Values1 sommeProduitRavitailles
   * @Values2 lastStockProduct
   * @Values3 ids_ravitaillement
   * @returns boolean
   * 
   */
  async initSomeInventoriesValues(): Promise<boolean>{
    try {

      let all_ravitaillements:  false | Ravitaillement[] = await this.getAllInventoriesRavitaillement();
      console.log("rav",all_ravitaillements)
      if(!all_ravitaillements){
        showToast("Aucun Ravitaillement encours", "danger");
        return false;
      }
      
      console.log("all_ravitaillements", all_ravitaillements)
      let sommeProduitRavitailles = await this.sommeProduitRavitailles(all_ravitaillements);
      console.warn(sommeProduitRavitailles)
      if(!sommeProduitRavitailles){
        console.log("Erreur somme ProduitRavitailles", "danger");
        return false 
      }
      // // Set Somme of restocks
      
      console.log("sommeProduitRavitailles", sommeProduitRavitailles)
      let ids_ravitaillement = this.getAllInventoriesRavitaillementIDS(all_ravitaillements);
      if(!ids_ravitaillement){
        console.log("ids_ravitaillement est false", ids_ravitaillement);
        return false
      }
      // Set Ids of restock
      this.inventorySvc.ids_ravitaillement = ids_ravitaillement;
      console.log("ids_ravitaillement", ids_ravitaillement)
      let lastStock: Reste[] | false = await this.getLastStock();
  
      if(!lastStock){
        console.log("lastStock defini",lastStock);
        return false
      }
      
      if(!lastStock[0].produits){
        console.log("lastStock[0].produits", lastStock[0].produits);
        return false
      }
      console.log("lastStock",lastStock);
      // Set last stock of product
      this.inventorySvc.lastStockProduct = JSON.parse(lastStock[0].produits);
      
      let produitVendu = this.inventorySvc.sommeProduitVendu(sommeProduitRavitailles, this.inventorySvc.lastStockProduct, this.inventorySvc.restes);
      // console.log("produit vendu ", produitVendu)
      if(!produitVendu){
        console.log("produitVendu", produitVendu)
        return false
      }


      if(!this.inventorySvc.isNotEmpty(JSON.parse(lastStock[0].produits)) && !this.inventorySvc.isNotEmpty(sommeProduitRavitailles)){
        console.log("Pas de stock disponible",lastStock);
        showToast("Pas de stock disponible. Ravitaillez votre stock", "danger");
        return false
      }

      this.inventorySvc.somProduitVendu = produitVendu;
      // console.log("produit vendu ", produitVendu)
      let total: number | "Error" = this.inventorySvc.sommePrix(this.inventorySvc.somProduitVendu);
      if(total == "Error"){
        console.log("total", total)
        return false
      }
      this.inventorySvc.montantTotalVendu = total;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }

  }

  /**
   * Take all uninventories ravitaillement from database
   * @returns Promise< Array<Ravitaillement> |false>
   */
  async getAllInventoriesRavitaillement(): Promise< Array<Ravitaillement> |false>{
    return await this.inventorySvc.getUninventoryRavitaillements();
  }

  /***
   * Extra product from ravitaillements list
   * @params all_ravitaillements: Array<Ravitaillement>
   * @return false | ProduitsRavitailles[][]
   */
  extractProductFromRavitaillement(all_ravitaillements: Array<Ravitaillement>): ProduitsRavitailles[][] | false{
    if(!all_ravitaillements.length){
      return [];
    }
    return this.inventorySvc.extractProductFromRavitaillement(all_ravitaillements);;
  }

  /**
   * Return list of Produits Ravitailles group by quantities
   * @param productRavitailles : ProduitsRavitailles[][]
   * 
   * @returns false | ProduitsRavitailles[]
   */
  sommeProductQuantities(productRavitailles : ProduitsRavitailles[][]):ProduitsRavitailles[]| false{
    if(!productRavitailles.length){
      return false;
    }
    return this.inventorySvc.sommeArrayProduits(productRavitailles)
  }

  async sommeProduitRavitailles(all_ravitaillements: Ravitaillement[]) : Promise<ProduitsRavitailles[] | false> {
    if(!all_ravitaillements.length){
      return [];
    }
    let prodRavitailles : ProduitsRavitailles[][] | false  =  this.extractProductFromRavitaillement(all_ravitaillements);
    if(!prodRavitailles){
      return false;
    }
    return this.sommeProductQuantities(prodRavitailles);
  }

  /**
   * Retour Id of all ravitaillement took for this inventory
   * @param all_ravitaillements Ravitaillement[]
   * 
   * @returns Array<number> | false
   */
  getAllInventoriesRavitaillementIDS(all_ravitaillements: Ravitaillement[]): Array<number> | false{
    if(!Array.isArray(all_ravitaillements)){
      console.log("the variable is not an Array");
      return false;
    }
    if(all_ravitaillements.some(rav => rav.id == undefined || !rav.id)){
      console.log("certaine id sont undefined ou null");
      return false;
    }
    return all_ravitaillements.map((rav:Ravitaillement) => rav.id as number);
  }

  /***
   * Return the last stock from database
   * @return Promise<Reste[]>
   */
  async getLastStock():Promise<Reste[] | false>{
    return await this.inventorySvc.getLastStock();
  } 
}
