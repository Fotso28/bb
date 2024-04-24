import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryPhoto, GalleryPhotos, Photo } from '@capacitor/camera';
import { ReadFileResult } from '@capacitor/filesystem';
import { IonInput, ToastController } from '@ionic/angular';
import { resetForm } from 'src/app/_lib/lib';
import { Employe } from 'src/app/models/Employes';
import { CameraService } from 'src/app/services/camera.service';
import { EmployeService } from 'src/app/services/employe.service';


@Component({
  selector: 'app-add-update-employe',
  templateUrl: './add-update-employe.page.html',
  styleUrls: ['./add-update-employe.page.scss'],
})
export class AddUpdateEmployePage implements OnInit {

  employeForm!: FormGroup;
  employe!: Employe;
  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private employeSvc: EmployeService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private cameraSvc: CameraService,
    private router: Router) { }

  ngOnInit() {
    this.employe = history.state;
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();
  }

  async initForm() {
    if(this.action == "update"){
      console.log("update")
      this.employeForm = this.formBuilder.group({
        nom: [this.employe.nom, Validators.required],
        adresse: [this.employe.adresse],
        phone1: [this.employe.phone1],
        cni: [this.employe.cni],
        photo: [this.employe.photo],
      });
      let pathNames: Array<any> = JSON.parse(this.employe.photo || '')
      console.log(pathNames)
      if(pathNames.length){
        pathNames.map(async (fileName: string)=>{
          let fileResult: ReadFileResult = await this.cameraSvc.readPhoto(fileName);
          this.photos.push({
            format: 'jpeg',
            webPath: '',
            fileName: fileName,
            data: fileResult.data as string
          })
          // console.log('file result est: ', fileResult)
        })
        // console.log(fileResult)
      }
      return;
    }
    this.employeForm = this.formBuilder.group({
        nom: ["", Validators.required],
        adresse: [""],
        phone1: [""],
        cni: [""],
        photo: [""],
    });
  }

  

  async submit() {

    if(this.employeForm.invalid) {
      this.showToast("Remplissez les champ!");
      return;
    }

    let savedImgPaths = await this.savePhotos();

    const formData = this.employeForm.value;
    
    let newEmploye : Employe = this.employeSvc.hydrateEmploye(formData);
    // console.log(newEmploye); return;
    if(this.photos.length){
      newEmploye.photo = JSON.stringify(savedImgPaths)
    }
    if(this.action === "update"){
      console.log("update")
      newEmploye.id = this.employe.id;
      newEmploye.deletedAt = this.employe.deletedAt;

      this.employeSvc.update(newEmploye).then((val)=>{
        if(val){
          this.showToast("element mis à jour")
          resetForm(this.employeForm);
          this.router.navigateByUrl("/employe")
        }
      }).catch((error)=> this.showToast("Veuillez réessayer"));

    }else{

      this.employeSvc.create(newEmploye).then((val)=>{
        if(val){
          this.showToast("Nouveau element créer")
          resetForm(this.employeForm);
          this.router.navigateByUrl("/employe")
        }
      }).catch((error)=> this.showToast("Veuillez réessayer"));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la employe à votre application
  }

  modifierEmploye() {
    const formData = this.employeForm.value;
    const employeModifiee = new Employe(formData.nom, formData.description, formData.deletedAt, formData.id);

    // Vous pouvez ajouter ici la logique pour modifier la employe dans votre application
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
    this.employeForm.get('nbre_btle_par_employe')?.setValue(filteredValue);
  }

  /**
   * Use to display image to the view
   */
  photos: (GalleryPhoto & {data?: string; fileName?: string})[] = [];
   /**
   * Use to display image to the view
   */
  addAttachments(): void{
    this.cameraSvc.pickImages().then((galleryPhotos: GalleryPhotos)=>{
      this.photos.push(...galleryPhotos.photos)
    })
  }

  /**
   * Remove url of image from @var photos
   * @param url Photo url
   */
  removeImagetoDisplayingImages(url:string|undefined):void{
    console.log('photos', this.photos)
    console.log('url', url)
    this.photos = this.photos.filter((filterdUrl: any) => (filterdUrl.webPath as string) != url && (filterdUrl.data as string) != url); 
  }

  async savePhotos(){
    if(!this.photos.length){
      console.log("not photos to save")
      return [];
    }

    // Remove all images that do not come to gallery
    // let toSavedImage: (GalleryPhoto & {data?: string; fileName?: string})[] = this.photos
    //                       .filter((photo:GalleryPhoto & {data?: string; fileName?: string}) => photo.webPath)
    
    // if(!toSavedImage.length){
    //   return []
    // }
    
    return Promise.all(
      this.photos.map((photo:GalleryPhoto & {data?: string; fileName?: string})=>{

        if(photo.webPath){
          let savedPhoto: Photo = {
            format: 'jpeg',
            webPath: (photo as GalleryPhoto).webPath,
            saved: true
          }
  
          return this.cameraSvc.saveImageToMemory(savedPhoto)
                .then((value: { filepath: string; webviewPath: string;})=>{
                  return value.filepath
                }).catch(err => console.log(err))
        }else{
          return photo.fileName
        }
        
      })
    )
  }

  
}
