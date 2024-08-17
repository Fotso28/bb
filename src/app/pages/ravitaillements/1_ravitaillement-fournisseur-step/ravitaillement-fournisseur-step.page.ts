import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ALPHA_NUMERIC } from 'src/app/_lib/const';
import { showToast, trimAndParseInt } from 'src/app/_lib/lib';
import { Fournisseur } from 'src/app/models/Fournisseurs';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { CameraService, ImageStruct } from 'src/app/services/camera.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-ravitaillement-fournisseur-step',
  templateUrl: './ravitaillement-fournisseur-step.page.html',
  styleUrls: ['./ravitaillement-fournisseur-step.page.scss'],
})
export class RavitaillementFournisseurStepPage implements OnInit {

  fournisseurForm!: FormGroup;

  fournisseurs: Array<Fournisseur> = [];

  ravitaillement! : Ravitaillement;
  
  action!: 'update' | 'add';

  presentingElement: any = null; // modal variable
  constructor(private formBuilder: FormBuilder, 
    private ravitaillementSvc: RavitaillementService,
    private cameraSvc: CameraService, 
    private modal: ModalController, private router: Router){}

  // initialFournisseurvalue: string = ""
  async ngOnInit() {
    try {
      this.initForm(); 
    } catch (error) {
      showToast("Une erreur");
      console.log(error);
    }
  }

  async ionViewWillEnter(){
    
    let _fournisseurs  = await this.getFournisseurs();
    _fournisseurs.map(async (fournisseur: Fournisseur) => {
      if(fournisseur.photo){
        console.warn(fournisseur);
        fournisseur.photo = await this.readImage(fournisseur.photo!);
      }
      return fournisseur;
    })
    this.fournisseurs = _fournisseurs;

    if(!this.fournisseurs.length){
      showToast("Aucun fournisseur! Veuillez Créer les fournisseurs!");
      return;
    }
    
    this.initFournisseur();

    console.log(this.ravitaillement);

    if(this.ravitaillement.num_facture == ""){
      this.fournisseurForm.patchValue({num_facture: ""})
    }

    if(this.ravitaillement.montant_verse == undefined || this.ravitaillement.montant_verse < 0){
      console.warn("le nomtant n'est pas conforme")
    }

    this.presentingElement = document.querySelector('.modal'); // modal initiation
  }

  // initialiaze fournisseur modal
  initFournisseur(){
    const FIRST_ARRAY_INDEX = 0;
    this.activeFournisseur = this.fournisseurs[FIRST_ARRAY_INDEX];
    this.fournisseurForm.controls['id_fournisseur'].patchValue(this.fournisseurs[FIRST_ARRAY_INDEX].id);
    this.fournisseurForm.controls['nom'].patchValue(this.fournisseurs[FIRST_ARRAY_INDEX].nom);
    this.ravitaillementSvc.fournisseurs = {id: this.fournisseurs[FIRST_ARRAY_INDEX].id!, nom: this.fournisseurs[FIRST_ARRAY_INDEX].nom!}
  }

  initForm() {
    this.ravitaillement = this.ravitaillementSvc.getRavitaillementInstance();
    console.log(this.ravitaillement.montant_verse);
    this.fournisseurForm = this.formBuilder.group({
      date: [(new Date()).toJSON(), [Validators.required]],
      id_fournisseur: [this.ravitaillement.id_fournisseur || '', Validators.required],
      nom: [this.ravitaillement.nom_fournisseur || '', Validators.required],
      num_facture: [this.ravitaillement.num_facture || '', [Validators.required, Validators.pattern(ALPHA_NUMERIC)]],
      montant_verse: ['0', [Validators.required, Validators.min(0), Validators.pattern(ALPHA_NUMERIC)]]
    });
  }

  async getFournisseurs(): Promise<any>{
    return await this.ravitaillementSvc.getFournisseurs();
  }

  montantChange($event: Event){
    this.fournisseurForm.get('montant_verse')?.markAsTouched();
  }

  activeFournisseur!: Fournisseur;
  fournisseurSelected(fournisseur: Fournisseur){
    this.ravitaillementSvc.fournisseurs = {id: fournisseur.id!, nom: fournisseur.nom}
    this.modal.dismiss();
    this.fournisseurForm.controls['id_fournisseur'].patchValue(fournisseur.id);
    this.fournisseurForm.controls['nom'].patchValue(fournisseur.nom);
    this.activeFournisseur = fournisseur;
  }

  closebtn = false;
  next(){
    try {
      
      if(this.fournisseurForm.invalid){
        showToast('champ incorrect');
        this.fournisseurForm.markAllAsTouched();
        return;
      }

      if(isNaN(trimAndParseInt(this.fournisseurForm.value.montant_verse))){
        showToast('Veuillez saisir le montant versé');
        return;
      }

      if(!this.ravitaillementSvc.fournisseurs?.id){
        showToast('Veuillez Choisir un fournisseur');
        return;
      }

      if(!this.fournisseurForm.value.num_facture){
        showToast('Numero de facture');
        return;
      }

      if(this.fournisseurForm.value.montant_verse < 0){
        showToast('Montant versé incorrect', 'danger');
        return;
      }

      this.ravitaillementSvc.getRavitaillementInstance().num_facture = this.fournisseurForm.value.num_facture;
      this.ravitaillementSvc.getRavitaillementInstance().photo_facture_url = this.fournisseurForm.value.photo_facture_url;
      this.ravitaillementSvc.getRavitaillementInstance().date = new Date(this.fournisseurForm.value.date).getTime();
      this.ravitaillementSvc.getRavitaillementInstance().montant_verse = trimAndParseInt(this.fournisseurForm.value.montant_verse);
      this.fournisseurForm.updateValueAndValidity();
      this.fournisseurForm.markAllAsTouched();
  
      this.router.navigateByUrl("/ravitaillement-produit-step");
  
      // console.log(this.ravStepOneValue);
      console.log(this.ravitaillementSvc.getRavitaillementInstance())
    } catch (error) {
      showToast("Une erreur s'est produite!!!");
      console.log(error)
    }
  }

  // For display image facture
  photo_facture_url: string | undefined = undefined
  async addImage(): Promise<ImageStruct | null>{
    let image: ImageStruct | null =  await this.cameraSvc.takePhoto();
    if(image){
      this.ravitaillementSvc.photo_facture = image.photo;
      this.photo_facture_url = image.photo?.webPath;
    }
    return image;
  }

  removeImage(){
    this.photo_facture_url = "";
  }

   async  readImage(imageName: string){
    if(imageName){
      let image = await this.cameraSvc.readPhoto(imageName);
      return 'data:image/jpeg;base64,'+image.data as string || '';
    }
    return '';
  }

}

type RavStepOneValues = {
  fournisseur: Fournisseur;
  num_facture: string;
  photo_facture_url: string;
}