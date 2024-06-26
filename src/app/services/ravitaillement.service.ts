import { Injectable } from '@angular/core';
import { Ravitaillement } from '../models/Ravitaillements';
import { BdService } from './-bd.service';
import { ProduitsRavitailles } from '../models/ProduitsRavitailles';
import { addToArray } from '../_lib/lib';
import { BehaviorSubject } from 'rxjs';
import { PointVenteService } from './point-vente.service';
import { Reste } from '../models/RestesModel';
import { Vente } from '../models/ProduitVendus';

@Injectable({
  providedIn: 'root'
})
export class RavitaillementService {

  ravitaillement!: Ravitaillement;
  listeProduitsRavitailles: ProduitsRavitailles[] = []
  behaviourSubject: BehaviorSubject<ProduitsRavitailles[]> = new BehaviorSubject<ProduitsRavitailles[]>([]);

  constructor(public bdSvc: BdService, private pvScv: PointVenteService) {
    if(!this.ravitaillement){
      this.ravitaillement = new Ravitaillement();
    }
  }

  set fournisseurs(fournisseur: {id:number, nom: string} | null){
    if(fournisseur?.id){
      this.getRavitaillementInstance().id_fournisseur = fournisseur.id;
      this.getRavitaillementInstance().nom_fournisseur = fournisseur.nom;
    }
  }

  get fournisseurs(): {id:number, nom: string} | null{
    if(this.getRavitaillementInstance().id_fournisseur){
      return {
        id: this.getRavitaillementInstance().id_fournisseur!,
        nom: this.getRavitaillementInstance().nom_fournisseur!
      }
    }else{
      return null
    }
  }

  getRavitaillementInstance(): Ravitaillement{
    if(this.ravitaillement){
      return this.ravitaillement
    }
    return new Ravitaillement();
  }


  setlisteProduitsRavitailles(produitRavitailles: ProduitsRavitailles){
    this.listeProduitsRavitailles = addToArray(this.listeProduitsRavitailles, produitRavitailles);
    
    this.behaviourSubject.next(this.listeProduitsRavitailles);
  }
  deleteProduitsRavitailles(produitRavitailles: ProduitsRavitailles){
    let arr = this.listeProduitsRavitailles.filter((item:any) => item.id != produitRavitailles.id);
    this.listeProduitsRavitailles = arr;
    this.behaviourSubject.next(this.listeProduitsRavitailles);
  }

  async getFournisseurs() {
    return this.bdSvc.readAll('Fournisseur');
  }

  async save(){
    this.getRavitaillementInstance().id_point_vente = this.pvScv.getActivePointeVente()?.id;
    let totot = await this.bdSvc.create(this.getRavitaillementInstance());
    // console.log(this.get)
  }
  
}



