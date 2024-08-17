import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReadFileResult } from '@capacitor/filesystem';
import { ModalController, NavController } from '@ionic/angular';
import { showError, showToast } from 'src/app/_lib/lib';
import { TestComponent } from 'src/app/components/test/test.component';
import { Categorie } from 'src/app/models/Categories';
import { Famille } from 'src/app/models/Familles';
import { Produit } from 'src/app/models/Produits';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { CameraService } from 'src/app/services/camera.service';
import { ProduitService } from 'src/app/services/produit.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-ravitaillement-produit-step',
  templateUrl: './ravitaillement-produit-step.page.html',
  styleUrls: ['./ravitaillement-produit-step.page.scss'],
})
export class RavitaillementProduitStepPage implements OnInit {

  produits: ProduitsRavitailles[] = []; // Tous les produits de la base de donnée
  produits_ravitailles: ProduitsRavitailles[] = []; // Tous les produits dans la liste des ravitaillements
  filtered_produits_ravitailles: ProduitsRavitailles[] = [];
  presentingElement: any = null;
  

  familles: Famille[] = [];
  categories: Categorie[] = [];
  constructor( private modal: ModalController, private ravitaillementSvc: RavitaillementService,
    private navCtrl: NavController, private router: Router, private produitSvc: ProduitService, public cameraSvc: CameraService) { }

  async ngOnInit() {
    if(!this.ravitaillementSvc.getRavitaillementInstance().nom_fournisseur){
      showError("Le fournisseur est mal defini")
    }
    this.ravitaillementSvc.behaviourSubject.subscribe({
      next: (value: ProduitsRavitailles[] ) =>{
        this.produits_ravitailles = value;
        console.log(value)
      },
      error: (err) =>{
        console.log(err)
      }
    });
    await this.initProduits();
    // this.presentingElement = document.querySelector('.modal'); // modal initiation
  }

  async initProduits(): Promise<void>{

    let nom_fournisseur = this.ravitaillementSvc.getRavitaillementInstance().nom_fournisseur
    
    if(!nom_fournisseur){
      showError("Le fournisseur est mal defini");
      return;
    }

    let produits: ProduitsRavitailles[] = await this.produitSvc.getProduitRavitaillesList(nom_fournisseur);
    console.log(produits)
    console.log(this.ravitaillementSvc.getRavitaillementInstance())
    if(produits && produits.length){
      // produits.map(async (prod: ProduitsRavitailles) => {
      //   if(prod.imgLink && /\.jpeg$/.test(prod.imgLink) && !/assets\/product-img\//.test(prod.imgLink)){
      //     console.log("je suis encore entrer")
      //     prod.imgLink = "assets/product-img/"+prod.imgLink
      //   }else{
      //     if(prod.imgLink && !/\.jpeg$/.test(prod.imgLink) ){
      //       prod.imgLink = await this.readImage(prod.imgLink!)
      //     }
      //   }
      //   });
      this.produits = await this.parseProduitImage(produits.reverse());
      console.log(produits)
    }
  }

  /**
   * Positionner les bonnes images par produit
   * @param produit 
   * @returns produit
   */
  async parseProduitImage(produit: ProduitsRavitailles[]){
    produit.map(async (prod: ProduitsRavitailles ) => {
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

  async ionViewWillEnter(){
    
    await this.initProduits();

    this.ravitaillementSvc.getRavitaillementInstance().total = this.sommePrix();
    
    this.familles = await this.produitSvc.getFamilles();

    this.categories = await this.produitSvc.getCategorie();
  }

  



  closebtn: boolean = false;
  next(){
    this.closebtn = true;
    if(!this.produits_ravitailles.length){ 
      this.closebtn = false;
      showError("Veuillez ajouter les produits et quantités"); 
      return 
    }
    this.ravitaillementSvc.getRavitaillementInstance()._produit_rav_liste = this.produits_ravitailles;
    this.ravitaillementSvc.getRavitaillementInstance().total =  this.sommePrix();
    console.log(this.ravitaillementSvc.getRavitaillementInstance());
    this.router.navigateByUrl("/ravitaillement-emballage-step");
    setTimeout(()=>{
      this.closebtn = false
    }, 500); 
  }

  //
  prev(){
    this.closebtn = true;
    setTimeout(()=>{
      this.closebtn = false
    }, 500)
    this.navCtrl.navigateBack("/ravitaillement-fournisseur-step");
  }
  

  async addProduitToRavitaillement(prod: ProduitsRavitailles){
    
    let prod_exit_index = this.produits_ravitailles.findIndex((p: ProduitsRavitailles) => +p.id == +prod.id)
    // console.log(this.ravitaillementSvc.getRavitaillementInstance())
    console.log(prod_exit_index);
    if(this.produits_ravitailles.length && prod_exit_index != -1){
      console.log('Le produit est',prod);
      prod = this.produits_ravitailles[prod_exit_index];
    }

    if(Object.keys(prod).includes('id') && Object.keys(prod).includes('qte_btle') && Object.keys(prod).includes('prixV') &&  Object.keys(prod).includes('nbreBtleParCasier') && Object.keys(prod).includes('prixA')){
      let product: ProduitsRavitailles = {
        id: prod.id!,
        nbreBtleParCasier: prod.nbreBtleParCasier!,
        nom: prod.nom,
        prixA: prod.prixA!,
        prixV: prod.prixV!,
        ristourne: prod.ristourne,
        qte_btle: prod.qte_btle || 0,
        famille: prod.famille,
        categorie: prod.categorie,
        imgLink: prod.imgLink,
      };
      this.router.navigateByUrl("/add-produit/add", {state: product});
      await this.modal.dismiss();
      console.log(product)
    }else{
      console.log("produit mal defini")
    }
  }

  addUpdateProduitToRavitaillement(produit: ProduitsRavitailles){

    if(!produit.id){
      showToast('Produit non defini')
      return
    }

    if(!produit.prixA || !produit.prixV || produit.prixA < 0 || produit.prixV < 0){
      showToast('Prix incorrect')
      return
    }

    if(!produit.nbreBtleParCasier){
      showToast('nombre de bouteille par casier incorrect')
      return
    }

    if(!produit.qte_btle || produit.qte_btle < 0){
      showToast('Le nombre de casier est incorrect');
      return
    }

    let produitRavitaille = new ProduitsRavitailles(
      produit.id!,
      produit.prixA!,
      produit.prixV!,
      produit.nbreBtleParCasier!,
      produit.nom,
    );

    produitRavitaille.ristourne = produit.ristourne;
    produitRavitaille.qte_btle = produit.qte_btle;
    produitRavitaille.famille = produit.famille;
    produitRavitaille.categorie = produit.categorie;
    produitRavitaille.imgLink = produit.imgLink;
    
    console.log(produitRavitaille);

    this.router.navigateByUrl("/add-produit/add", {state: produitRavitaille})
  }

  // addToArray(arr: Array<any>, item: any){
  //   const index = arr.findIndex(elt => item.id === elt.id);
  //   if(index === -1){
  //     arr.push(item);
  //   }else{
  //     arr[index] = item;
  //   }
  //   return arr;
  // }

  // updateListesProduct(arr_in: Array<ProduitsRavitailles | Produit>, arr_out: Array<ProduitsRavitailles | Produit>){
  //   return arr_out.filter((e: ProduitsRavitailles | Produit) => {
  //     arr_in.forEach((p: ProduitsRavitailles | Produit) => {
  //       return p.id != e.id;
  //     });
  //   })
  // }

  deleteProd(prod: ProduitsRavitailles){
    this.ravitaillementSvc.deleteProduitsRavitailles(prod);
    this.ravitaillementSvc.getRavitaillementInstance().total = this.sommePrix();
    console.log(this.ravitaillementSvc.getRavitaillementInstance().total)
  }

  

  sommePrix(): number {
    return this.produits_ravitailles.reduce((somme, produit) =>{
      console.log("reste", (produit?.qte_btle! % produit.nbreBtleParCasier) * produit?.prixA! / produit.nbreBtleParCasier)
      console.log("Total div", Math.floor(produit?.qte_btle! / produit.nbreBtleParCasier) * produit.prixA)
      if(produit?.prixA && produit?.qte_btle){
        return somme + Math.floor( produit?.qte_btle / produit.nbreBtleParCasier) * produit?.prixA + produit?.qte_btle % produit.nbreBtleParCasier * produit?.prixA / produit.nbreBtleParCasier
      }else{
        return somme
      }
    }, 0);
  }
}