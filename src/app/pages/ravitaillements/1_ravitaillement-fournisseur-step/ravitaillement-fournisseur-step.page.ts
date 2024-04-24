import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Fournisseur } from 'src/app/models/Fournisseurs';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-ravitaillement-fournisseur-step',
  templateUrl: './ravitaillement-fournisseur-step.page.html',
  styleUrls: ['./ravitaillement-fournisseur-step.page.scss'],
})
export class RavitaillementFournisseurStepPage implements OnInit {

  fournisseurForm!: FormGroup;

  fournisseurs: Array<Fournisseur> = [];

  
  action!: 'update' | 'add';

  presentingElement: any = null; // modal variable
  constructor(private formBuilder: FormBuilder, 
    private ravitaillementSvc: RavitaillementService, 
    private modal: ModalController, private router: Router){}

  // initialFournisseurvalue: string = ""
  async ngOnInit() {
    // let rav = this.ravitaillementSvc.getRavitaillementInstance();
    // rav._produit_rav_liste = [
    //   {id:1, nom: 'Fotso', prixA:  2500, prixV: 2000, qte: 1, qte_par_casier: 1500},
    //   {id:2, nom: 'Fotso', prixA: 1500, prixV: 2000, qte: 1, qte_par_casier: 1500}
    // ]
    // console.log('Voici le contenu',rav)
    try {
      this.initForm();
      this.fournisseurs  = await this.getFournisseurs();
      if(!this.fournisseurs.length){
        showToast("Aucun fournisseur! Veuillez Créer les fournisseurs!");
        return;
      }
      this.initFournisseur();
      console.log(this.fournisseurs)
      this.presentingElement = document.querySelector('.modal'); // modal initiation
    } catch (error) {
      showToast("Une erreur");
      console.log(error);
    }
  }

  // initialiaze fournisseur modal
  initFournisseur(){
    const FIRST_ARRAY_INDEX = 0;
    this.fournisseurForm.controls['id_fournisseur'].patchValue(this.fournisseurs[FIRST_ARRAY_INDEX].id);
    this.fournisseurForm.controls['nom'].patchValue(this.fournisseurs[FIRST_ARRAY_INDEX].nom);
    this.ravitaillementSvc.fournisseurs = {id: this.fournisseurs[FIRST_ARRAY_INDEX].id!, nom: this.fournisseurs[FIRST_ARRAY_INDEX].nom!}
  }

  initForm() {
    const ravitaillement : Ravitaillement = this.ravitaillementSvc.getRavitaillementInstance();

    this.fournisseurForm = this.formBuilder.group({
      id_fournisseur: [ravitaillement.id_fournisseur || '', Validators.required],
      nom: [ravitaillement.nom_fournisseur || '', Validators.required],
      num_facture: [ravitaillement.num_facture || ''],
      photo_facture_url: [ravitaillement.photo_facture_url || '']
    });
  }

  async getFournisseurs(): Promise<any>{
    return await this.ravitaillementSvc.getFournisseurs();
  }

  fournisseurSelected(fournisseur: Fournisseur){
    this.ravitaillementSvc.fournisseurs = {id: fournisseur.id!, nom: fournisseur.nom}
    this.modal.dismiss();
    this.fournisseurForm.controls['id_fournisseur'].patchValue(fournisseur.id);
    this.fournisseurForm.controls['nom'].patchValue(fournisseur.nom);
  }

  closebtn = false;

  next(){
    console.log(this.fournisseurForm.value);
    try {
      if(!this.ravitaillementSvc.fournisseurs?.id){
        showToast('Veuillez Choisir un fournisseur');
        return;
      }
  
      this.closebtn = true;
      setTimeout(()=>{
        this.closebtn = false;
      }, 1500);
      // this.ravitaillementSvc.getRavitaillementInstance().id_fournisseur = this.ravStepOneValue.fournisseur.id;
      this.ravitaillementSvc.getRavitaillementInstance().num_facture = this.fournisseurForm.value.num_facture;
      this.ravitaillementSvc.getRavitaillementInstance().photo_facture_url = this.fournisseurForm.value.photo_facture_url;
  
      
  
      this.router.navigateByUrl("/ravitaillement-produit-step");
  
      // console.log(this.ravStepOneValue);
      console.log(this.ravitaillementSvc.getRavitaillementInstance())
    } catch (error) {
      showToast("Une erreur s'est produite!!!");
      console.log(error)
    }
  }

}

type RavStepOneValues = {
  fournisseur: Fournisseur;
  num_facture: string;
  photo_facture_url: string;
}