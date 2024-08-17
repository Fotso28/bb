import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { NavController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Casier } from 'src/app/models/Casiers';
import { PointVente } from 'src/app/models/PointVentes';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { Custom_Casier_Model, TransactionType } from 'src/app/models/Ravitaillements';
import { CasierService } from 'src/app/services/casier.service';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { ProduitService } from 'src/app/services/produit.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';


@Component({
  selector: 'app-ravitaillement-emballage-step',
  templateUrl: './ravitaillement-emballage-step.page.html',
  styleUrls: ['./ravitaillement-emballage-step.page.scss'],
})
export class RavitaillementEmballageStepPage implements OnInit {
  readonly transactionTypeIn = TransactionType.IN
  readonly transactionTypeOut = TransactionType.OUT
  casiers: Custom_Casier_Model[] = [];
  typeCasiers: Casier[] = [ ];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    public pvSvc: PointVenteService,
    private casierScv: CasierService,
    private ravSvc: RavitaillementService,
    private produitSvc: ProduitService
  ) {}

  ngOnInit() {
  }

  deteleCasier(casier: Custom_Casier_Model){
    if(casier){
      this.casiers = this.casiers.filter((cs: Custom_Casier_Model) => cs.nom != casier.nom);
    }
  }

  async ionViewWillEnter(){
      //check if product exist


      console.warn("this.ravSvc.getRavitaillementInstance()", this.ravSvc.getRavitaillementInstance())
      if(!this.ravSvc.getRavitaillementInstance().produits){
        showToast("Aucun produit ravitaillés")
        console.log("Aucun produit ravitaillés");
        this.router.navigateByUrl("/ravitaillement-produit-step");
        return
      }
      
      let _produitRavitailles: ProduitsRavitailles[] = JSON.parse(this.ravSvc.getRavitaillementInstance().produits);
      // console.warn(_produitRavitailles)
      if(!_produitRavitailles.length){
        showToast("Aucun produit ravitaillés")
        console.log("Aucun produit ravitaillés");
        this.router.navigateByUrl("/ravitaillement-produit-step");
        return
      }
    
      let _produits = (await this.getProduitByName(_produitRavitailles.map((prod: any)=>prod.nom)))
      let _casiers: false | Casier[] = (await this.casierScv.getAll());
      if(!_casiers){
        showToast("Les casiers ne sont pas renseignés")
        console.log("Les casiers ne sont pas renseignés");
        this.router.navigateByUrl("/ravitaillement-produit-step");
        return
      }
      let casiers : Casier[] = _casiers;
      if(!_produits){
        showToast("Renseigner les produits à ravitailler")
        console.log("Aucun produit ravitaillés");
        this.router.navigateByUrl("/ravitaillement-produit-step");
        return
      }

      let produits : any = _produits.values;
      if(!produits){
        showToast("Renseigner les produits à ravitailler")
        console.log("Aucun produit ravitaillés");
        this.router.navigateByUrl("/ravitaillement-produit-step");
        return
      }

      let prod_mapped = produits.map((prod: any) => {
        let elt: any = {};
        let nom_casier = casiers.find((cas: any) => cas.id == prod.id_casier);
        let produitRavitailles = _produitRavitailles.find((p: any) => p.nom == prod.nom)
        elt.casier = nom_casier;
        elt.produitRavitailles = produitRavitailles
        return elt;
      })
      console.warn(produits)

      // check is all casier is ok
      let all_casier_is_notok = prod_mapped.some((prod:any) => prod.casier == undefined)
      if(all_casier_is_notok){
        console.log("Probleme avec les casiers"),
        this.router.navigateByUrl("/ravitaillement-produit-step");
        return
      }



      // list casiers
      await this.casierScv.getAll();
      this.casierScv.casierSubject.subscribe({
        next: (casiers: Casier[]) =>{
          if(casiers.length){
            let list_casier : Custom_Casier_Model[] = casiers.map((casier: Casier) => {
              
              let val: Custom_Casier_Model = {
                id: casier?.id!,
                nom: casier?.nom!,
                qte: 0,
                transaction: TransactionType.IN
              }
              if(casier.nbre_btle_par_casier == 12){
                this.defaultCasier = val
                console.warn(this.defaultCasier)
              }
              return val;
            })
            this.typeCasiers = list_casier;
          }
        }
      })
      let parse_data = this.parse_casier(prod_mapped);
      
      parse_data.forEach((prod: any) => this.addCasier(TransactionType.IN, prod.casier, Math.floor(prod.qte_btle / prod.nbreBtleParCasier)))
  }
  
  defaultCasier: Casier = <Casier>{}; 
  parse_casier(tr:any[  ]){
    let elt: {[nom: number]: {nom: string, casier: Casier, qte_btle: number, nbreBtleParCasier: number}} = {};
    tr.forEach((e:any) =>{
      console.log(e);
      if(elt[e.casier.nom]){
        elt[e.casier.nom] = {
          nom: e.casier.nom,
          casier: e.casier,
          qte_btle: (+elt[e.casier.nom].qte_btle) + (+e.produitRavitailles.qte_btle),
          nbreBtleParCasier: e.produitRavitailles.nbreBtleParCasier
        }
      }else{
        elt[e.casier.nom] = {
          nom: e.casier.nom,
          casier: e.casier,
          qte_btle: +e.produitRavitailles.qte_btle,
          nbreBtleParCasier: e.produitRavitailles.nbreBtleParCasier
        }
      }
    })
    return Object.values(elt);
  }

  async getProduitByName(name: Array<string>): Promise<DBSQLiteValues | false>{
    return await this.produitSvc.getProduitByName(name)
  }

  next(){
    let pv: PointVente = this.pvSvc.getActivePointeVente() as PointVente;
    this.ravSvc.getRavitaillementInstance().id_point_vente = pv.id;


    this.router.navigateByUrl('/ravitaillement-confirmation-step/add');
    this.ravSvc.getRavitaillementInstance()._casier = this.casiers;
  }
  prev(){
    this.navCtrl.navigateBack('/ravitaillement-produit-step');
    this.ravSvc.getRavitaillementInstance()._casier = this.casiers;
  }

  /**
   * add Element to casiers
   * @param transactionType 
   * @param casier 
   * @param qte 
   * @returns void
   */
  addCasier(transactionType: TransactionType, casier: Casier, qty: HTMLInputElement | number){
    
    let quantite: number = typeof qty == "number" ? qty : parseInt(qty?.value , 10);
    // console.log({transaction: transactionType, casier: casier, qte: quantite})
    if(isNaN(quantite) || quantite < 1){
      showToast('Quantité doit être superieure à 0', "danger");
      return
    }

    if(!casier){
      showToast('Renseigner le casier', "danger");
      return
    }

    if(transactionType && Object.keys(casier).includes('nom') && quantite){

      let casierExist = this.casiers.findIndex((value: Custom_Casier_Model) => value.nom == casier.nom && value.transaction == transactionType);
      let newCasier : Custom_Casier_Model = {id: 0, nom: casier.nom!, qte: quantite, transaction: transactionType };
      if(casierExist == -1){
        // init id of casier
        newCasier.id = this.casiers.length ? this.casiers[this.casiers.length - 1].id + 1 : 1;
        this.casiers.push(newCasier);
      }else{
        // replace casier
        newCasier.id = this.casiers[casierExist].id;
        this.casiers[casierExist] = newCasier;
      }
      if(typeof qty !== "number"){
        qty.value = ""
      }
    }else{
      showToast('Une erreur', "danger");
      return
    }
    console.log(this.casiers)
  }

}
