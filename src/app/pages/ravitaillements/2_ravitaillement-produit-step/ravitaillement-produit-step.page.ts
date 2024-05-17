import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { TestComponent } from 'src/app/components/test/test.component';
import { Produit } from 'src/app/models/Produits';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
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
  
  constructor( private modal: ModalController, private ravitaillementSvc: RavitaillementService,
    private navCtrl: NavController, private router: Router, private produitSvc: ProduitService) { }

  async ngOnInit() {
    this.ravitaillementSvc.behaviourSubject.subscribe({
      next: (value: ProduitsRavitailles[] ) =>{
        this.produits_ravitailles = value;
        
        console.log(value)
      },
      error: (err) =>{
        console.log(err)
      }
    })
    this.presentingElement = document.querySelector('.modal'); // modal initiation
  }

  async ionViewWillEnter(){
    await this.initProduits();
    // this.filtreProduit();
    console.log(this.search_key)

    this.ravitaillementSvc.getRavitaillementInstance().total = this.sommePrix();

    console.log(this.ravitaillementSvc.getRavitaillementInstance().total)
  }

  

  async initProduits(): Promise<void>{
    let produits: ProduitsRavitailles[] = await this.produitSvc.getProduitRavitaillesList();
    console.log(produits)
    if(produits && produits.length){
      this.produits = produits;
      this.filtered_produits_ravitailles = this.produits;
    }
  }

  closebtn = false;
  next(){
    this.closebtn = true;
    this.ravitaillementSvc.getRavitaillementInstance()._produit_rav_liste = this.produits_ravitailles;
    this.ravitaillementSvc.getRavitaillementInstance().total =  this.sommePrix();
    console.log(this.ravitaillementSvc.getRavitaillementInstance());
    this.router.navigateByUrl("/ravitaillement-emballage-step");
    setTimeout(()=>{
      this.closebtn = false
    }, 1500); 
  }
  prev(){
    this.closebtn = true;
    setTimeout(()=>{
      this.closebtn = false
    }, 1500)
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
    
    console.log(produitRavitaille);

    this.router.navigateByUrl("/add-produit/add", {state: produitRavitaille})
}

  addToArray(arr: Array<any>, item: any){
    const index = arr.findIndex(elt => item.id === elt.id);
    if(index === -1){
      arr.push(item);
    }else{
      arr[index] = item;
    }
    return arr;
  }

  updateListesProduct(arr_in: Array<ProduitsRavitailles | Produit>, arr_out: Array<ProduitsRavitailles | Produit>){
    return arr_out.filter((e: ProduitsRavitailles | Produit) => {
      arr_in.forEach((p: ProduitsRavitailles | Produit) => {
        return p.id != e.id;
      });
    })
  }

  deleteProd(prod: ProduitsRavitailles){
    this.ravitaillementSvc.deleteProduitsRavitailles(prod);
    this.ravitaillementSvc.getRavitaillementInstance().total = this.sommePrix();
    console.log(this.ravitaillementSvc.getRavitaillementInstance().total)
  }

  search_key: string = "";
  filtreProduit(){
    if(!this.search_key){
      this.filtered_produits_ravitailles = this.produits
    }else{
      this.filtered_produits_ravitailles = this.produits.filter((prod: ProduitsRavitailles) =>{
        return prod.nom.toLowerCase().includes(this.search_key.toLowerCase()) || prod?.famille?.toLowerCase().includes(this.search_key.toLowerCase()) || prod?.categorie?.toLowerCase().includes(this.search_key.toLowerCase())
      })
    }
  }

  sommePrix(): number {

    
    return this.produits_ravitailles.reduce((somme, produit) =>{
      console.log("reste",(produit?.qte_btle! % produit.nbreBtleParCasier) * produit?.prixA! / produit.nbreBtleParCasier)
      console.log("Total div", Math.floor(produit?.qte_btle! / produit.nbreBtleParCasier) * produit.prixA)
      if(produit?.prixA && produit?.qte_btle){
        return somme + Math.floor( produit?.qte_btle / produit.nbreBtleParCasier) * produit?.prixA + produit?.qte_btle % produit.nbreBtleParCasier * produit?.prixA / produit.nbreBtleParCasier
      }else{
        return somme
      }
    }, 0);
  }
}