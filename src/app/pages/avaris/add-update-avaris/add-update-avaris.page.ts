import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, IonModal, IonSelect, ToastController } from '@ionic/angular';
import { isValidJSON, resetForm, showError, showToast, trimAndParseInt } from 'src/app/_lib/lib';
import { Avaris } from 'src/app/models/Avaris';
import { PointVente } from 'src/app/models/PointVentes';
import { Produit } from 'src/app/models/Produits';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { Reste } from 'src/app/models/RestesModel';
import { AvarisService } from 'src/app/services/avaris.service';
import { CameraService } from 'src/app/services/camera.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { PointVenteService } from 'src/app/services/point-vente.service';

@Component({
  selector: 'app-add-update-avaris',
  templateUrl: './add-update-avaris.page.html',
  styleUrls: ['./add-update-avaris.page.scss'],
})
export class AddUpdateAvarisPage implements OnInit {

  @ViewChild("produitElt", { static: false }) produitElt! : IonSelect;
  @ViewChild("modal", { static: false }) modal! : IonModal;
  avarisForm!: FormGroup;
  avaris!: Avaris;

  produits : Produit[] = [];
  produit! : Produit;
  presentingElement: any = null; // modal variable
  
  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private avarisSvc: AvarisService,
    private route: ActivatedRoute,
    private cameraSvc: CameraService,
    private inventorySvc: InventoryService,
    private pointVenteSvc: PointVenteService,
    private router: Router) { 
      this.presentingElement = document.querySelector('.modal');
    }

  async ngOnInit() {
    const memo = history.state as Avaris;
    if(memo.hasOwnProperty("id")){ this.avaris = this.avarisSvc.hydrateAvaris(memo) };
    
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    console.log(this.action, "ceci est l'action en cours")
    let _produits: Array<Produit> = await this.avarisSvc.getProduit();
    this.produits = await this.parseProduitImage(_produits);
    if(!this.produits.length){
      showToast("Aucun produit! Veuillez remplir les produits");
    }
    if(this.action == "update"){
      // get product
      let _temp = this.produits.filter((prod: Produit) => prod.id == this.avaris.produit_id);
      this.produit = _temp[0]
      console.warn(this.produit)
    }else{
      this.produit = this.produits[0]!
    }
    console.log(this.produits);
    this.initForm();

    if(this.produits.length < 1) return showToast('Veuillez paramétrer le produit');

  }

  /**
   * Positionner les bonnes images par produit
   * @param produit 
   * @returns produit
   */
  async parseProduitImage(produit: Produit[]){
    produit.map(async (prod: Produit ) => {
      if(prod.imgLink && /\.jpeg$/.test(prod.imgLink) && !/assets\/product-img\//.test(prod.imgLink)){
        console.log("je suis encore entrer")
        prod.imgLink = "assets/product-img/"+prod.imgLink
      }else{
        if(prod.imgLink && !/\.jpeg$/.test(prod.imgLink) ){
          prod.imgLink = await this.readImage(prod.imgLink!)
        }
      }
    });
    return produit;
  }

  async  readImage(imageName: string){
    if(imageName){
      let image = await this.cameraSvc.readPhoto(imageName);
      return 'data:image/jpeg;base64,'+image.data as string || '';
    }
    return '';
  }

  initForm() {
      this.avarisForm = this.formBuilder.group({
        qte: [this.avaris?.qte?.toString() || '1', [Validators.required, Validators.pattern(/^[0-9\s]+$/), Validators.min(1)]],
        description: [this.avaris?.description || ''],
        date: [this.avaris?.date || (new Date()).toJSON(), [Validators.required]]
      });
  }

  async submit() {
    try {
      // console.log(this.avarisForm.value); return;
      if(this.avarisForm.invalid) {
        console.log(this.avarisForm.value)
        showToast("Remplissez les champ!");
        return;
      }
     
      if(!(this.produit && Object.keys(this.produit).includes('id'))){
        console.log("pas de produit");
        return;
      }
     
      let qtyProductInStock: number | false = await this.qtyProductInStock();
      console.warn(qtyProductInStock);
      
      if(qtyProductInStock !== 0 && !qtyProductInStock){
        console.log("une erreur s'est produite")
        return;
      }

      

      const formData = this.avarisForm.value;

      if(!formData.qte || !trimAndParseInt(formData.qte)){
        showToast('Veuillez saisir la quantité');
        return;
      }
      // le nombre de produit Avarié enregistrer non mis à jour dans la table des stocks
      let qty_of_all_unventory_product = await this.avarisSvc.getAllUninventoryArarisPerProduct(this.produit.id!);
      
      let newAvaris : Avaris = this.avarisSvc.hydrateAvaris(formData);
      
      let rule: boolean;
      console.log(qty_of_all_unventory_product);
    
      if(!qty_of_all_unventory_product){
        rule = (+formData.qte) > (+qtyProductInStock)
      }else{
        rule = (+formData.qte) + (+qty_of_all_unventory_product) > (+qtyProductInStock)
      }
      
      
      if(rule){
        showError(`Le stock de ce produit est de
           ${qtyProductInStock} bouteille${qtyProductInStock <= 1 ? '' : 's'}. 
           Le nombre d'avaris doit être inferieur`);
        return;
      }
      
      let _point_vente: PointVente | null = this.pointVenteSvc.getActivePointeVente();
      if(!_point_vente){
        return;
      }
      
      newAvaris.produit_id = this.produit.id;
      newAvaris.produit_nom = this.produit.nom;
      newAvaris.point_vente_id = _point_vente.id
      
      console.log(newAvaris, "new Avaris");
      // return;
      if(this.action === "update"){
        console.log("update")
        newAvaris.id = this.avaris.id;

        this.avarisSvc.update(newAvaris).then((val: any)=>{
          if(val){
            showToast("element mis à jour");
            resetForm(this.avarisForm);
            this.router.navigateByUrl("/avaris");
          }
        }).catch((error:any)=> showToast("Veuillez réessayer", 'danger'));

      }else{

        this.avarisSvc.create(newAvaris).then((val)=>{
          if(val){
            showToast("Nouveau element créer");
            resetForm(this.avarisForm);
            this.router.navigateByUrl("/avaris");
          }
        }).catch((error:any)=> showToast("Veuillez réessayer", 'danger'));

      }
    } catch (error) {
      console.log(error)
    }
    // Vous pouvez ajouter ici la logique pour ajouter la Avaris à votre application
  }


  // @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;
  // filteredNumber(ev:any){
  //   const value = ev.target!.value;

  //   // Removes non alphanumeric characters
  //   const filteredValue = value.replace(/[^0-9]+/g, '');

  //   /**
  //    * Update both the state variable and
  //    * the component to keep them in sync.
  //    */
  //   this.avarisForm.get('qte')?.setValue(filteredValue);
  // }

  // valueChange($event: Event){
  //   let number = ($event as CustomEvent).detail.value;
  //   let prod = this.produits.filter((prod: Produit) => prod.id == number);
  //   this.produit = prod[0]!;
  // }

  openModal(){
    this.produitElt.open();
    console.log(this.produitElt)
  }

  selectProd(produit: Produit){
    this.produit = produit;
    this.modal.dismiss();
  }

  /***
   * Return the last stock from database
   * @return Promise<Reste[]>
   */
  async getLastStock():Promise<Reste[] | false>{
    return await this.inventorySvc.getLastStock();
  }

  checkProduitExist(): boolean{
    if(!(this.produit && this.produit.id)){
      return false;
    }
    return true;
  }

  async qtyProductInStock(): Promise<number | false>{
    try {
      // Get last reste
      let reste: Reste[] | false = await this.getLastStock();
      // get the list of uninventories ravitaillements
      let _uninventories_ravillement: Ravitaillement[] | false = await this.inventorySvc.getUninventoryRavitaillements();
      
      if(reste && !reste.length && !(_uninventories_ravillement && _uninventories_ravillement.length)){
        // it means that no product enter to the database
        console.log('Aucun produit en stock');
        return 0;
      }

      if(!this.checkProduitExist()){
          console.log("le produit n'existe pas");
      }

      let nombre_reste = 0; // nombre du produit en cours dans le tableau des restes
      let nombre_ravitaille = 0; // nombre du produit en cours dans le tableau des produit ravitaillés

      if(reste && reste.length){
        let _produit: string = reste[0].produits;
        if(!(isValidJSON(_produit))){
          console.log("mauvais format JSON", _produit);
          return false;
        }

        let reste_produit: ProduitsRavitailles[] = JSON.parse(_produit);

        nombre_reste = this.getProductQuantityById(reste_produit, this.produit.id!)
      }

      if(_uninventories_ravillement && _uninventories_ravillement.length){
        let _list_produit_ravitailles = this.inventorySvc.extractProductFromRavitaillement(_uninventories_ravillement);
        console.log(_list_produit_ravitailles, this.produit.id);
          if(_list_produit_ravitailles){
            _list_produit_ravitailles.forEach((prod_ravitaille: ProduitsRavitailles[]) => {
              nombre_ravitaille = this.getProductQuantityById(prod_ravitaille, this.produit.id!) + nombre_ravitaille;
            });
          }
      }
      return nombre_reste + nombre_ravitaille;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

    /**
   * Calculates the total quantity of a specific product by its ID.
   * 
   * @param produitsRavitailles - Array of products restocked.
   * @param id - The ID of the product to find the quantity for.
   * @returns The total quantity of the product with the given ID.
   */
  getProductQuantityById(produitsRavitailles: ProduitsRavitailles[], id: number): number {
    // Initialize quantity to 0
    let qty: number = 0;

    // Iterate through the array of products
    produitsRavitailles.forEach(prod => {
        if (prod.id == id) {
            qty += prod.qte_btle ?? 0;
        }
    });

    // Return the total quantity
    return qty;
  };

}
