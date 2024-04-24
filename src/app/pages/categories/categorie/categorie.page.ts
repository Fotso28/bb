import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Categorie, CategorieType } from 'src/app/models/Categories';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.page.html',
  styleUrls: ['./categorie.page.scss'],
})
export class CategoriePage implements OnInit {

  categories : Categorie[] = [];
  type!: CategorieType
  constructor(
    private categorieSvc: CategorieService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type') as CategorieType;
    this.initializeCategorieData();
    console.log(this.type)
  }

  async initializeCategorieData(): Promise<void>{
    let all = await this.categorieSvc.getAll();
    console.log(all)
    this.categorieSvc.categorieSubject.subscribe({
      next: (items: Categorie[]) => {
        this.categories = items.filter((elt:any) => elt.type == this.type);
        console.log(items);
      }
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

  async delete(categorie: Categorie, slidingItem:any){
    slidingItem.close();
    let item : Categorie = this.categorieSvc.hydrateCategorie(categorie);
    let role = await this.confirm();
    if(role == "confirm"){
      this.categorieSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(categorie:Categorie){
    if(!this.type){
      console.log("le type n'st pas defini"); return;
    }
    this.router.navigateByUrl(`/add-update-categorie/update/${this.type}`, {state: categorie});
  }

}
