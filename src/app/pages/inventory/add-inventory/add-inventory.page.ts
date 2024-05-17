import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { showError, showToast } from 'src/app/_lib/lib';
import { PointVente } from 'src/app/models/PointVentes';
import { Vente } from 'src/app/models/ProduitVendus';
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
        (this.productForm.get('quantities') as FormArray).markAllAsTouched();
        return;
      }
  
      const quantities = this.productForm.value.quantities;
      let restes: ProduitsRavitailles[] | false = this.combineProductsAndValues(this.produits, quantities);
      
      if(!restes){
        showToast("Erreur avec function restes()", "danger");
        console.log("Erreur avec function restes()")
        return;
      }
        
      this.inventorySvc.restes = restes;
      
      console.log(restes)
      this.router.navigateByUrl("/more-detail");

      
  
      // let all_ravitaillements: Array<Ravitaillement> |false= await this.getUninventoryRavitaillements(); 
      // if(!all_ravitaillements || !all_ravitaillements.length){
      //   showToast('pas de ravitaillement en cours', 'danger');
      //   console.log("pas de ravitaillement")
      //   return;
      // }
  
      // let prodRavitailles = this.extractProductFromRavitaillement(all_ravitaillements);
      // if(!prodRavitailles){
      //   showToast("Erreur avec function extractProductFromRavitaillement()", "danger");
      //   console.log("Erreur avec function extractProductFromRavitaillement()")
      //   return false;
      // }
      // let sommeProduitRavitailles = this.sommeArrayProduits(prodRavitailles);
  
      // if(!sommeProduitRavitailles){
      //   showToast("Erreur avec function sommeArrayProduits()", "danger");
      //   console.log("Erreur avec function sommeArrayProduits()")
      //   return false;
      // }
  
      // let ids_ravitaillement:  Array<number | undefined> = Array.isArray(all_ravitaillements) ? all_ravitaillements.map(rav => rav.id) : [];
      
  
      // console.log("les ravitaillemnt venant de la bd", sommeProduitRavitailles);
      // let lastStock: Reste[] | false = await this.getLastStock();
      // console.log("Je suis le last stock",lastStock)
      // if(!lastStock){
      //   showToast("Erreur avec function lastStock()", "danger");
      //   console.log("Erreur avec function lastStock()")
      //   return false;
      // }
  
      // let lastStockProduct: ProduitsRavitailles[] = lastStock.length ? JSON.parse(lastStock[0].produits) as ProduitsRavitailles[] : [];
      
      // console.warn(lastStock);
      // await this.saveCurrentStock(restes);
      
      // let isSaved = await this.saveProduitVendu(sommeProduitRavitailles, lastStockProduct,restes,ids_ravitaillement);
      // let isUpdate = await this.ravSvc.markAllAsRavitaille();
      // console.log("isUpdate est ", isUpdate);
      
      // return isSaved
    } catch (error) {
      console.log(error);
    }
  }
   /***
   * Recupere les valeurs dans le formulaire auto generee et le mets dans la variable de classe
   * this.produits
   */
   private combineProductsAndValues(products: any[], values: number[]): ProduitsRavitailles[] | false {
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

}
