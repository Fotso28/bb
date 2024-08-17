import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, IonModal } from '@ionic/angular';
import { Produit } from 'src/app/models/Produits';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { CameraService } from 'src/app/services/camera.service';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-list-produit',
  templateUrl: './list-produit.component.html',
  styleUrls: ['./list-produit.component.scss'],
})
export class ListProduitComponent  implements OnInit {
  
  @Input('modal') modal!: IonModal;
  @Input() produits_ravitailles: ProduitsRavitailles[] = [];
  @Input() produits: ProduitsRavitailles[] = [];
  
  @Output() emitProduitEvent: EventEmitter<ProduitsRavitailles> = new EventEmitter()
  @Output() emitDeleteProduitEvent: EventEmitter<{produit: ProduitsRavitailles, slidingItem: IonItemSliding}> = new EventEmitter()
  
  categories: any[] = [];
  familles: any[] = [];
  filtered_produits_ravitailles: any[] = [];
  search_key: string = '';


  constructor(private cameraSvc: CameraService, private router: Router, private produitSvc: ProduitService){}

  async ngOnInit() {
    this.familles = await this.produitSvc.getFamilles();
    this.categories = await this.produitSvc.getCategorie();
    this.filtered_produits_ravitailles = this.produits;
    console.log(this.produits)
  }

   // verifie si categorie et famille existe dans dans les produits filtrés
  hasElement(famille: string, categorie: string= ""){
    if(categorie == ""){
      return this.filtered_produits_ravitailles.some((val: ProduitsRavitailles) => val.famille == famille);
    }
    return this.filtered_produits_ravitailles.some((val: ProduitsRavitailles) => val.categorie == categorie && val.famille == famille)
  }


  filtreProduit(){
    const normalizeString = (str: string | undefined) => {
      if(str){
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      }
      return ""
    };
    if(!this.search_key){
      this.filtered_produits_ravitailles = this.produits
    }else{
      const searchKeyNormalized = normalizeString(this.search_key);
      this.filtered_produits_ravitailles = this.produits.filter((prod: ProduitsRavitailles) =>{
        return prod.nom.toLowerCase().includes(searchKeyNormalized) || 
        normalizeString(prod?.famille).includes(searchKeyNormalized) || 
        normalizeString(prod?.categorie).includes(searchKeyNormalized);
      })
    }
  }

  async  readImage(imageName: string){
    if(imageName){
      let image = await this.cameraSvc.readPhoto(imageName);
      return 'data:image/jpeg;base64,'+image.data as string || '';
    }
    return '';
  }

  // verifie si produit existe dans la liste des produits ravitailles
  prodIsRavitaille(prod: ProduitsRavitailles){
    return this.produits_ravitailles.some((val: ProduitsRavitailles) => val.id == prod.id);
  }

  

  emitProduct(prod: ProduitsRavitailles){
    if(prod){
      this.emitProduitEvent.emit(prod);
    }
  }

  emitDelete(produit: ProduitsRavitailles, slidingItem: IonItemSliding){
    if(produit){
      this.emitDeleteProduitEvent.emit({produit, slidingItem});
    }
  }
}
