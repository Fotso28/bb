import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { ALPHA_NUMERIC } from 'src/app/_lib/const';
import { showToast, trimAndParseInt } from 'src/app/_lib/lib';
import { Casier } from 'src/app/models/Casiers';
import { Produit } from 'src/app/models/Produits';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { CasierService } from 'src/app/services/casier.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-add-produit',
  templateUrl: './add-produit.page.html',
  styleUrls: ['./add-produit.page.scss'],
})
export class AddProduitPage implements OnInit {

  produitForm!: FormGroup;

  produit! : ProduitsRavitailles;
  casier!: Casier | false;
  // produitRavitaille! : ProduitsRavitailles;
  // qte_btle_sup! : number;
  emballage! : string;
  action!: 'update' | 'add';

  constructor( private ravitaillementSvc: RavitaillementService, 
    private casierSvc: CasierService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router){}

  async ngOnInit() {

    this.produit = history.state as ProduitsRavitailles;

    console.log(this.produit)

    if(!Object.keys(this.produit).includes('id') ){
      showToast('Veuillez paramétrer le produit');
      this.router.navigateByUrl('/ravitaillement-produit-step');
      return
    }
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
  
    this.initForm();   
    
  }

  initForm() {
    console.log(this.produit)
    this.produitForm = this.formBuilder.group({
      nom_produit:  [this.produit.nom,    Validators.required],
      qte_casier:   [this.produit.qte_btle ? Math.floor(this.produit.qte_btle / this.produit.nbreBtleParCasier).toString() : '0',    [Validators.required, Validators.min(1), Validators.pattern(ALPHA_NUMERIC)]],
      qte_btle_sup: [this.produit.qte_btle ? (this.produit.qte_btle % this.produit.nbreBtleParCasier).toString() : '0'],
    });
  }



  addUpdateProduitToRavitaillement(){
    
      if(this.produitForm.invalid){
        this.produitForm.markAllAsTouched();
        showToast("Remplissez tous les champs");
        return;
      }

      if(!this.produitForm.value.qte_casier || this.produitForm.value.qte_casier < 1){
        showToast("Quantité incorrect");
        return;
      }

      if(!this.produit.id){
        showToast('Produit non defini')
        return
      }

      if(!this.produit.prixA || !this.produit.prixV || this.produit.prixA < 0 || this.produit.prixV < 0){
        showToast('Prix incorrect')
        return
      }

      if(!this.produit.nbreBtleParCasier){
        showToast('nombre de bouteille par casier incorrect')
        return
      }

      if(!this.produitForm.value.qte_casier || this.produitForm.value.qte_casier < 0){
        showToast('Le nombre de casier est incorrect');
        return
      }

      if(!this.produitForm.value.qte_casier || this.produitForm.value.qte_casier < 0){
        showToast('Le nombre de casier est incorrect');
        return
      }

      let produitRavitaille = new ProduitsRavitailles(
        this.produit.id!,
        this.produit.prixA!,
        this.produit.prixV!,
        this.produit.nbreBtleParCasier!,
        this.produit.nom,
      );

      produitRavitaille.ristourne = this.produit.ristourne;
      produitRavitaille.qte_btle = trimAndParseInt(this.produitForm.value.qte_casier) * (+this.produit.nbreBtleParCasier) + trimAndParseInt(this.produitForm.value.qte_btle_sup);
      produitRavitaille.famille = this.produit.famille;
      produitRavitaille.categorie = this.produit.categorie;
      produitRavitaille.hasCasier = this.produit.hasCasier;
      produitRavitaille.imgLink = this.produit.imgLink;
      
      this.ravitaillementSvc.setlisteProduitsRavitailles(produitRavitaille);
      this.router.navigateByUrl("/ravitaillement-produit-step")
  }

  

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;
  filteredNumber(ev:any){
    const value = ev.target!.value;
    // Removes non alphanumeric characters
    const filteredValue = value.replace(/[^0-9]+/g, '');

    /**
     * Update both the state variable and
     * the component to keep them in sync.
     */
    this.produitForm.get('nbre_btle_par_produit')?.setValue(filteredValue);
  }

 

  

}
