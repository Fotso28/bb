import { Injectable } from '@angular/core';
import { Ravitaillement } from '../models/Ravitaillements';
import { BdService } from './-bd.service';
import { ProduitsRavitailles } from '../models/ProduitsRavitailles';
import { addToArray } from '../_lib/lib';
import { BehaviorSubject } from 'rxjs';
import { PointVenteService } from './point-vente.service';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class RavitaillementService {

  ravitaillement!: Ravitaillement;
  listeProduitsRavitailles: ProduitsRavitailles[] = []
  behaviourSubject: BehaviorSubject<ProduitsRavitailles[]> = new BehaviorSubject<ProduitsRavitailles[]>([]);
  photo_facture!: Photo;
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
    console.warn("this.listeProduitsRavitailles",this.listeProduitsRavitailles)
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

  async getRavitaillement(ids: Array<number>): Promise<Ravitaillement[]>{
    let sql = `SELECT * FROM Ravitaillement WHERE id IN (${ids})`;
    return (await this.bdSvc.query(sql)).values as Ravitaillement[];
  }

  clearRavitaillement(){
    this.ravitaillement = new Ravitaillement();
    this.photo_facture = <Photo>{}
    this.listeProduitsRavitailles = [];
    this.behaviourSubject.next([]);
  }

  async getListRavitaillementByDate(debut: number, fin: number, fournisseur_id:number, pointVente_id:number){
    return  await this.bdSvc.readAll("Ravitaillement", ` AND date >= ${debut} AND date <= ${fin} AND id_fournisseur = ${fournisseur_id} AND id_point_vente = ${pointVente_id}`);
  }
  
}



