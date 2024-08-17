import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { ReadFileResult } from '@capacitor/filesystem';
import { IonInput, ToastController } from '@ionic/angular';
import { confirmAlert, resetForm, showToast } from 'src/app/_lib/lib';
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
  produit_img_data!: string;

  constructor(private formBuilder: FormBuilder, 
    private fournisseurSvc: FournisseurService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private cameraSvc: CameraService,
    private router: Router) { }

  async ngOnInit() {

    this.fournisseur = history.state;
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';

    console.log(this.image?.photo.webPath);
    if(this.fournisseur.photo){
      this.readImage(this.fournisseur.photo!).then((val:string) =>{
        this.produit_img_data = val;
      });
    }

    this.initForm();

    if(this.fournisseur.photo){
      console.log(this.fournisseur.photo);
      if(/\.jpeg$/.test(this.fournisseur.photo) && !/assets\/product-img\//.test(this.fournisseur.photo)){
        this.fournisseur.photo = await this.readImage(this.fournisseur.photo!)
      }
      this.produit_img_data = this.fournisseur.photo;
    }
  }

  initForm() {
    this.fournisseurForm = this.formBuilder.group({
      nom: [this.fournisseur.nom || '', Validators.required],
      adresse: [this.fournisseur.adresse || '', Validators.required],
      phone1: [this.fournisseur.phone1 || '', Validators.required],
      collecte_ristourne: [this.fournisseur.collecte_ristourne == undefined ? true : this.fournisseur.collecte_ristourne],
      photo: [this.fournisseur.photo || ''],
    });
  }

  markAllFieldsAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllFieldsAsTouched(control);
      }
    });
  }

  async submit() {

    if(this.fournisseurForm.invalid) {
      showToast("Remplissez tous les champs!", 'danger');
      this.fournisseurForm.markAllAsTouched();
      return;
    }

    const formData = this.fournisseurForm.value;

    let newFournisseur : Fournisseur = this.fournisseurSvc.hydrateFournisseur(formData);
    
    if(this.image){
      let imgIsSaved = await this.saveImage(this.image);
      newFournisseur.photo = imgIsSaved?.filepath;
    }

    if(this.action === "update"){
      console.log("update", newFournisseur);
      newFournisseur.id = this.fournisseur.id;
      newFournisseur.deletedAt = this.fournisseur.deletedAt;

      this.fournisseurSvc.update(newFournisseur).then((val: any)=>{
        if(val){
          showToast("element mis à jour")
          resetForm(this.fournisseurForm);
          this.router.navigateByUrl("/fournisseur")
        }
      }).catch((error:any)=> showToast("Veuillez réessayer", 'danger'));

    }else{

      this.fournisseurSvc.create(newFournisseur).then((val)=>{
        if(val){
          showToast("Nouvel element créer")
          console.log(val)
          resetForm(this.fournisseurForm);
          this.router.navigateByUrl("/fournisseur")
        }
      }).catch((error:any)=> showToast("Veuillez réessayer", 'danger'));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la Fournisseur à votre application
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

  image!: ImageStruct | null;
  async takeImage(): Promise<void>{
    this.image = await this.cameraSvc.takePhoto();
    console.log(this.image)
  }

  async saveImage(image:ImageStruct): Promise<{ filepath: string, webviewPath: string } | null>{
    if(image){
      return await this.cameraSvc.saveImageToMemory(image?.photo);
    }
    return null
  }

  async readImage(imageName: string):Promise<string>{
    let image: ReadFileResult = await this.cameraSvc.readPhoto(imageName);
    return 'data:image/jpeg;base64,'+image.data as string || '' 
  }

  async removeImage(){
    let role = await confirmAlert();
    if(role == "confirm"){
      this.image = null
      this.produit_img_data = "";
      this.fournisseur.photo = "";
      this.fournisseurForm.value.photo = "";
    }
  }

  

}
