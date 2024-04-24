import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { IonInput, ToastController } from '@ionic/angular';
import { resetForm } from 'src/app/_lib/lib';
import { Fournisseur } from 'src/app/models/Fournisseurs';
import { CameraService, ImageStruct } from 'src/app/services/camera.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-add-update-fournisseur',
  templateUrl: './add-update-fournisseur.page.html',
  styleUrls: ['./add-update-fournisseur.page.scss'],
})
export class AddUpdateFournisseurPage implements OnInit {

  fournisseurForm!: FormGroup;
  fournisseur!: Fournisseur;
  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private fournisseurSvc: FournisseurService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private cameraSvc: CameraService,
    private router: Router) { }

  ngOnInit() {
    this.fournisseur = history.state;
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();
  }



 
  
  
 

  initForm() {
    if(this.action == "update"){
      console.log("update")
      this.fournisseurForm = this.formBuilder.group({
        nom: [this.fournisseur.nom, Validators.required],
        adresse: [this.fournisseur.adresse],
        phone1: [this.fournisseur.phone1],
        collecte_ristourne: this.fournisseur.collecte_ristourne,
        photo: [this.fournisseur.photo],
      });
      return;
    }
    this.fournisseurForm = this.formBuilder.group({
        nom: ["", Validators.required],
        adresse: [""],
        phone1: [""],
        collecte_ristourne: false,
        photo: [""],
    });
  }

  

  submit() {

    if(this.fournisseurForm.invalid) {
      this.showToast("Remplissez les champ!");
      return;
    }

    const formData = this.fournisseurForm.value;

    let newFournisseur : Fournisseur = this.fournisseurSvc.hydrateFournisseur(formData);
    // console.log(newFournisseur); return;
    if(this.action === "update"){
      console.log("update")
      newFournisseur.id = this.fournisseur.id;
      newFournisseur.deletedAt = this.fournisseur.deletedAt;

      this.fournisseurSvc.update(newFournisseur).then((val: any)=>{
        if(val){
          this.showToast("element mis à jour")
          resetForm(this.fournisseurForm);
          this.router.navigateByUrl("/fournisseur")
        }
      }).catch((error:any)=> this.showToast("Veuillez réessayer"));

    }else{

      this.fournisseurSvc.create(newFournisseur).then((val)=>{
        if(val){
          this.showToast("Nouveau element créer")
          resetForm(this.fournisseurForm);
          this.router.navigateByUrl("/fournisseur")
        }
      }).catch((error:any)=> this.showToast("Veuillez réessayer"));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la Fournisseur à votre application
  }

  modifierFournisseur() {
    const formData = this.fournisseurForm.value;
    const fournisseurModifiee = new Fournisseur(formData.nom, formData.description, formData.deletedAt, formData.id);

    // Vous pouvez ajouter ici la logique pour modifier la Fournisseur dans votre application
  }

  async showToast(message: string){
    let toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: "bottom",
      icon: "home",
      mode: 'ios',
      color: "danger",
    });
    await toast.present()
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
    this.fournisseurForm.get('nbre_btle_par_fournisseur')?.setValue(filteredValue);
  }

  async addImage(): Promise<ImageStruct | null>{
    return await this.cameraSvc.takePhoto();
  }

  async saveImage(photo: Photo): Promise<{filepath: string, webviewPath: string}>{
    return await this.cameraSvc.saveImageToMemory(photo);
  }

}
