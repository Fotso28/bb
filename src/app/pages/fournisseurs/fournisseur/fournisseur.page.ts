import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Fournisseur } from 'src/app/models/Fournisseurs';
import { Produit } from 'src/app/models/Produits';
import { CameraService } from 'src/app/services/camera.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.page.html',
  styleUrls: ['./fournisseur.page.scss'],
})
export class FournisseurPage implements OnInit {

  fournisseurs : Fournisseur[] = [];
  constructor(
    private fournisseurSvc: FournisseurService,
    private cameraSvc: CameraService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    this.initializeFournisseurData();
  }

  async initializeFournisseurData(): Promise<void>{
    let all = await this.fournisseurSvc.getAll();
    console.log(all)
    this.fournisseurSvc.fournisseurSubject.subscribe({
      next: async (items: Fournisseur[]) => {
        this.fournisseurs = await this.parseFournisseurImage(items);
        console.log(items);
      },
      error: err => console.log(err)
    })
  }

  async confirm(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Etes vous sûr ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Oui',
          role: 'confirm',
        },
        {
          text: 'Non',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role;
  }

  async delete(fournisseur: Fournisseur, slidingItem:any){
    slidingItem.close();
    let item : Fournisseur = this.fournisseurSvc.hydrateFournisseur(fournisseur);
    let role = await this.confirm();
    if(role == "confirm"){
      this.fournisseurSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(fournisseur:Fournisseur){
    this.router.navigateByUrl("/add-update-fournisseur/update", {state: fournisseur});
  }

    /**
   * Positionner les bonnes images par produit
   * @param produit 
   * @returns produit
   */
    async parseFournisseurImage(fournisseur: Fournisseur[]){
      fournisseur.map(async (four: Fournisseur) => {
        if(four.photo && /^preconfig-/.test(four.photo) && /\.jpeg$/.test(four.photo)){
          console.log("je suis encore entrer")
          four.photo = "assets/fournisseur-img/"+four.photo
        }else{
          if(four.photo){
            four.photo = await this.readImage(four.photo!)
          }
        }
      });

      // val.map(async (prod: Produit) =>{
      //   if(prod.imgLink && /^preconfig-/.test(prod.imgLink) && /\.jpeg$/.test(prod.imgLink)){
      //     console.log("je suis encore entrer")
      //     prod.imgLink = "assets/product-img/"+prod.imgLink
      //   }else{
      //     if(prod.imgLink){
      //       prod.imgLink = await this.readImage(prod.imgLink!)
      //     }
      //   }
      // })

      return fournisseur;
    }

    async  readImage(imageName: string){
      if(imageName){
        let image = await this.cameraSvc.readPhoto(imageName);
        return 'data:image/jpeg;base64,'+image.data as string || '';
      }
      return '';
    }
}
