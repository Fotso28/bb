import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { showError, showToast, sommeArrayProduits, trimAndParseInt } from 'src/app/_lib/lib';
import { Avaris } from 'src/app/models/Avaris';
import { Produit } from 'src/app/models/Produits';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { Reste } from 'src/app/models/RestesModel';
import { AvarisService } from 'src/app/services/avaris.service';
import { CameraService } from 'src/app/services/camera.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { LoggerService } from 'src/app/services/logger.service';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.page.html',
  styleUrls: ['./add-inventory.page.scss'],
})
export class AddInventoryPage implements OnInit {

  productForm!: FormGroup;
  produits: ProduitsRavitailles[] = [];
  prodRav: ProduitsRavitailles[][] = [];
  constructor(private formBuilder: FormBuilder, private cameraSvc: CameraService, 
    private logger: LoggerService, private produitSvc: ProduitService,
    private router: Router, private productSvc: ProduitService, private pointVenteSvc: PointVenteService,
    private inventorySvc: InventoryService, private avarisSvc: AvarisService ) {
    
  }

  async ngOnInit() {
  
    let _produits = await this.productSvc.getProduitRavitaillesList();
    
    if(_produits.length){
      _produits.map(async (prod: ProduitsRavitailles) =>{
        if(prod.imgLink && /^preconfig-/.test(prod.imgLink) && /\.jpeg$/.test(prod.imgLink)){
          console.log("je suis encore entrer")
          prod.imgLink = "assets/product-img/"+prod.imgLink
        }else{
          if(prod.imgLink){
            prod.imgLink = await this.readImage(prod.imgLink!)
          }
        }
      })
    }

    this.produits = _produits;
    this.inventorySvc.produits = this.produits;

    this.buildForm();

     
  }

  async  readImage(imageName: string){
    if(imageName){
      let image = await this.cameraSvc.readPhoto(imageName);
      return 'data:image/jpeg;base64,'+image.data as string || '';
    }
    return '';
  }

  /***
   * Return the last stock from database
   * @return Promise<Reste[]>
   */
  async getLastStock():Promise<Reste[] | false>{
    return await this.inventorySvc.getLastStock();
  } 

  private async getUninventoryAvaris(): Promise<Avaris[] | false> {
    return await this.avarisSvc.getAllUninventoryAvaris();
  }

  private async getProductsRavitailles(): Promise<ProduitsRavitailles[]>{
    return await this.produitSvc.getProduitRavitaillesList();
  }

  async updateLastStoWithAvaris(): Promise<boolean>{
    try {
      let lastStock: false | Reste[] = await this.getLastStock();
      console.log(lastStock);

      let uninventoryAvaris: false | Avaris[] = await this.getUninventoryAvaris();
      console.log(uninventoryAvaris);

      if (!uninventoryAvaris || !uninventoryAvaris.length) {
        this.logger.log("Aucun avari non traité trouvé.");
        return false;
      }
      
      let newStock: ProduitsRavitailles[] | false;

      if (!lastStock || !lastStock.length) {
        let _produitsRavitailles = await this.getProductsRavitailles();
        if(_produitsRavitailles.length){
          _produitsRavitailles.map((prod: ProduitsRavitailles)=> {
            delete prod.imgLink;
            return prod;
          })
          newStock = this.createNewStock(_produitsRavitailles, uninventoryAvaris);
        }else{
          this.logger.log("Aucun stock précédent trouvé.");
          return false;
        }
      }else{
        newStock = this.createNewStock(JSON.parse(lastStock[0].produits), uninventoryAvaris);
      }

      if(!newStock){
        showError("Erreur avec le nouveau stock");
        return false;
      }

      let pv = this.pointVenteSvc.getActivePointeVente();

      if(!pv || !pv.id){
        return false;
      }

      let reste: Reste = new Reste(new Date().getTime(), JSON.stringify(newStock));
      reste.type = 'sto_update';
      reste.id_point_vente = pv.id;
      reste.ids_ravitaillement = "";

      // console.log(JSON.parse(reste.produits));
      
      let saved: boolean = await this.saveNewStock(reste);
      saved = this.avarisSvc.setAvarisIntoried();
      return saved;
    } catch (error) {
      showError(error);
      return false;
    }
  }

  private async saveNewStock(newStock: Reste): Promise<boolean> {
    try {
      // let reste: Reste = new Reste(new Date().getTime(), JSON.stringify(newStock),0,0,"");
      await this.inventorySvc.saveStock(newStock);
      return true;
    } catch (error) {
      this.logger.log("Erreur lors de l'enregistrement du nouveau stock", error);
      return false;
    }
  }

  /**
   * Crée un nouveau stock en ajustant les quantités des produits du dernier stock en 
   * fonction des avaris non traités.
   * 
   * @param lastStock - Un tableau des derniers stocks, où chaque élément contient 
   * les informations des produits stockés.
   * @param uninventoryAvaris - Un tableau des avaris non traités, chaque élément 
   * représentant une quantité d'avari à soustraire du stock.
   * 
   * @returns Un tableau de `ProduitsRavitailles` représentant le nouveau stock 
   * après ajustement des quantités.
   */
  private createNewStock(lastStock: ProduitsRavitailles[], uninventoryAvaris: Avaris[]): ProduitsRavitailles[] | false {

    try {
      const stockMap = new Map<number, ProduitsRavitailles>();

      // Étape 2: Convertir le dernier stock en une map pour un accès rapide
      lastStock.forEach(item => {
        stockMap.set(item.id, item);
      });

      // Étape 3: Soustraire les quantités d'avaris du stock
      uninventoryAvaris.forEach((avari: Avaris) => {
        if (!avari.produit_id || !avari.qte) {
          console.error('Avaris contains null or undefined values:', avari);
          throw new Error('Avaris contains null or undefined values:')
        }
        // Récupérer l'élément de stock correspondant à l'id de l'avari
        const stockItem = stockMap.get(avari.produit_id!);
        if (stockItem) {
          stockItem.qte_btle = (stockItem.qte_btle || 0) - (avari.qte! || 0);
          stockMap.set(avari.produit_id!, stockItem);
        }
      });

      // Étape 4: Convertir la map en tableau et retourner le résultat
    return Array.from(stockMap.values()) as ProduitsRavitailles[];
    } catch (error) {
      return false;
    }
  }



  buildForm() {
    if(this.produits && this.produits.length > 0){
      const formControls = this.produits.map(product =>  new FormControl('0', [Validators.required, Validators.min(0), Validators.max(99999)]));
      this.productForm = this.formBuilder.group({ quantities: new FormArray(formControls) });
    }
  }

  getQuantityControl(index: number) {
    return ((this.productForm.get('quantities') as FormArray).controls[index] as FormControl<any>);
  }

  async onSubmit() {
    // return;
    try {
      if(this.productForm.invalid){
        showToast("Formulaire incorrect", "danger");
        (this.productForm.get('quantities') as FormArray).markAllAsTouched();
        return;
      }
  
      const quantities = this.productForm.value.quantities.map((value: string) =>{
        return !value ? 0 : Number(value);
      });

      if(quantities.some((elt: any) => elt = NaN)){
        this.logger.log("Remplissez tous les champs");
        showToast("Certaines valeur sont erronées")
        return;
      }

      let produits = this.produits.slice()
      // affecter les quantites au objets de type ProduitRavitailles
      let restes: ProduitsRavitailles[] | false = this.combineProductsAndValues(produits, quantities);
      this.logger.log(restes)
      if(!restes){
        showToast("Erreur avec function restes()", "danger");
        this.logger.log("Erreur avec function restes()")
        return;
      }
        
      this.inventorySvc.restes = restes;

      // update table reste if there are avaris
      this.updateLastStoWithAvaris();

      // initialise inventory variable  
      let isInit: boolean = await this.initSomeInventoriesValues();
      if(!isInit){
        return 
      }
      this.router.navigateByUrl("/more-detail");
    } catch (error) {
      this.logger.log(error);
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
      this.logger.warn(values)
      if(!values.every(val => typeof val === 'number')){
        throw new Error("values error");
      }
      return Array.from(products, (product, i) => {
        product.qte_btle = trimAndParseInt(values[i].toString());
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
      this.logger.log("rav", all_ravitaillements)
      if(!all_ravitaillements){
        showToast("Aucun Ravitaillement encours", "danger");
        return false;
      }
      
      this.logger.log("all_ravitaillements", all_ravitaillements)
      let sommeProduitRavitailles = await this.sommeProduitRavitailles(all_ravitaillements);
      this.logger.warn(sommeProduitRavitailles)
      if(!sommeProduitRavitailles){
        this.logger.log("Erreur somme ProduitRavitailles", "danger");
        return false 
      }
      // // Set Somme of restocks
      
      this.logger.log("sommeProduitRavitailles", sommeProduitRavitailles)
      let ids_ravitaillement = this.getAllInventoriesRavitaillementIDS(all_ravitaillements);
      if(!ids_ravitaillement){
        this.logger.log("ids_ravitaillement est false", ids_ravitaillement);
        return false
      }
      // Set Ids of restock
      this.inventorySvc.ids_ravitaillement = ids_ravitaillement;
      this.logger.log("ids_ravitaillement", ids_ravitaillement)
      let lastStock: Reste[] | false = await this.getLastStock();
  
      if(!lastStock){
        this.logger.log("lastStock defini",lastStock);
        return false
      }
      
      // Set last stock of product
      this.inventorySvc.lastStockProduct = lastStock.length ? JSON.parse(lastStock[0].produits) : [];
      this.inventorySvc.lastStockProduct_id = lastStock.length ? (lastStock[0].id ? lastStock[0].id : 0) : 0
      
      let produitVendu = this.inventorySvc.sommeProduitVendu(sommeProduitRavitailles, this.inventorySvc.lastStockProduct, this.inventorySvc.restes);
      // this.logger.log("produit vendu ", produitVendu)
      if(!produitVendu){
        this.logger.log("produitVendu", produitVendu)
        return false
      }


      if(!this.inventorySvc.isNotEmpty(lastStock.length ? JSON.parse(lastStock[0].produits) : []) && !this.inventorySvc.isNotEmpty(sommeProduitRavitailles)){
        this.logger.log("Pas de stock disponible",lastStock);
        showToast("Pas de stock disponible. Ravitaillez votre stock", "danger");
        return false
      }

      this.inventorySvc.somProduitVendu = produitVendu;
      // this.logger.log("produit vendu ", produitVendu)
      let total: number | "Error" = this.inventorySvc.sommePrix(this.inventorySvc.somProduitVendu);
      if(total == "Error"){
        this.logger.log("total", total)
        return false
      }
      this.inventorySvc.montantTotalVendu = total;
      return true;
    } catch (error) {
      this.logger.log(error);
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
    return sommeArrayProduits(productRavitailles)
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
      this.logger.log("the variable is not an Array");
      return false;
    }
    if(all_ravitaillements.some(rav => rav.id == undefined || !rav.id)){
      this.logger.log("certaine id sont undefined ou null");
      return false;
    }
    return all_ravitaillements.map((rav:Ravitaillement) => rav.id as number);
  }

  
}
