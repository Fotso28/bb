import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Produit } from 'src/app/models/Produits';
import { CameraService } from 'src/app/services/camera.service';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.page.html',
  styleUrls: ['./produit.page.scss'],
})
export class ProduitPage implements OnInit {

  produits : Produit[] = [];
  show: boolean = false;

  constructor(
    private produitSvc: ProduitService,
    private cameraSvc: CameraService,
    private elementRef: ElementRef,
    private actionSheetCtrl: ActionSheetController,
    private router: Router) {}

  async ngOnInit() {}

  ionViewWillEnter(){
    this.initializeProduitData();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Cacher le menu lorsque l'utilisateur clique en dehors de #main
      this.show = !this.show;
    }
  }

  onScroll(event: any){
    if(this.show == true){
      this.show = false
    }
  }

  async initializeProduitData(): Promise<void>{
    
    await this.produitSvc.getAll();
    
    this.produitSvc.produitSubject.subscribe({
      next: (val: Produit[]) =>{
        console.log(val)
        val.map(async (prod: Produit) =>{
          if(prod.imgLink && /^preconfig-/.test(prod.imgLink) && /\.jpeg$/.test(prod.imgLink)){
            console.log("je suis encore entrer")
            prod.imgLink = "assets/product-img/"+prod.imgLink
          }else{
            if(prod.imgLink){
              prod.imgLink = await this.readImage(prod.imgLink!)
            }
          }
        })
        this.produits = val;
      },
      error: (err) => console.log(err)
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

  async delete(produit: Produit, slidingItem:any){
    slidingItem.close();
    let item : Produit = this.produitSvc.initProduitValues(produit);
    let role = await this.confirm();
    console.log(role);
    if(role == "confirm"){
      this.produitSvc.delete(item).then((value:boolean)=>{
        console.log(value)
        if(value){
          this.initializeProduitData();
          showToast('Bien supprimé!')
        }
      }).catch((e)=> console.log(e))
    }  
  }

  gotoFamilleDetail(produit:Produit){
    this.router.navigateByUrl("/add-update-produit/update", {state: produit});
  }

  async  readImage(imageName: string){
    if(imageName){
      let image = await this.cameraSvc.readPhoto(imageName);
      return 'data:image/jpeg;base64,'+image.data as string || '';
    }
    return '';
  }
}
