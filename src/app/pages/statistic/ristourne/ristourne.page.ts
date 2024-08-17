import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {  IonModal, ModalController } from '@ionic/angular';
import { getDate, sommeDesRistournes, sommeRistournesEtQuantitesParRavitaillement } from 'src/app/_lib/lib';
import { Fournisseur } from 'src/app/models/Fournisseurs';
import { PointVente } from 'src/app/models/PointVentes';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { CameraService } from 'src/app/services/camera.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { LoggerService } from 'src/app/services/logger.service';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-ristourne',
  templateUrl: './ristourne.page.html',
  styleUrls: ['./ristourne.page.scss'],
})
export class RistournePage implements OnInit {
  @ViewChild('datedebut', { static: true }) ionModalDateDebut!: IonModal;
  @ViewChild('datefin', { static: true }) ionModalDateFin!: IonModal;
  fournisseurs: Fournisseur[] = [];
  ravitaillements: Array<Ravitaillement & {ristourne: number, qte:number}> = [];
  debut: string | false = "2024-01-01T18:25:00";
  end: string | false = new Date().toJSON();
  activeFournisseur!: Fournisseur;
  ristourne!: number | false;
  constructor( private ravitaillementSvc: RavitaillementService, private fournisseurSvc: FournisseurService, 
    private router: Router, private ravSvc: RavitaillementService, private cameraSvc: CameraService, private logger: LoggerService,
    private pointVenteSvc: PointVenteService, private modal: ModalController) { }

  async ngOnInit() {}
  
  async ionViewWillEnter(){
    let _returnvalue = await this.getAllFournisseur();
    this.fournisseurSvc.fournisseurSubject.subscribe({
      next: async (value: any) => {
        if(value.length){
          try {
            // Utiliser Promise.all pour attendre la résolution de toutes les promesses
            // const fournisseursAvecPhotos = await Promise.all(
              value.map(async (prod: Fournisseur) => {
                prod.photo = await this.readImage(prod.photo!);
                return prod;
              })
            // );
            
            this.fournisseurs = value;
            if(this.getLastBeginDate()){
              this.debut = this.getLastBeginDate()!;
            }
            // this.logger.warn(this.activeFournisseur)
            if(this.activeFournisseur == undefined || this.activeFournisseur == null){
              // to define active fournisseur
              if(this.getActiveFournisseur()){
                this.activeFournisseur = this.getActiveFournisseur()!;
              }else{
                this.activeFournisseur = this.fournisseurs[0];
              }
              this.calculRistourne()
            }
          } catch (error) {
            this.logger.log(error)
          }
        }
      },
      error: (err: any) => this.logger.log(err)
    })
  }

  async  readImage(imageName: string){
    if(imageName){
      let image = await this.cameraSvc.readPhoto(imageName);
      return 'data:image/jpeg;base64,'+image.data as string || '';
    }
    return '';
  }

  getDate(date: number | Date | string){
    return getDate(date, true);
  }

  async getAllFournisseur(){
    return await this.fournisseurSvc.getAll();
  }

  async fournisseurSelected(fournisseur: Fournisseur){
    this.activeFournisseur = fournisseur;
    await this.modal.dismiss();
    await this.calculRistourne();
  }

  async getNewDate(event: Event, type: string){
    let newDate = (event as CustomEvent).detail.value;
    this.logger.log(newDate)
    if(newDate){
      if(type == "debut"){
        this.debut = newDate;
      }
      
      if(type == "fin"){
        this.end = newDate;
      }
  
      await this.calculRistourne();
    }
  }

  /**
   * Set End date for ristourne calculs
   * @param endDate 
   */
  setLastBeginDate(endDate: string){
    if(endDate){
      localStorage.setItem('endDate', endDate);
    }else{
      console.warn("pas de date de fin")
    }
  }
  /**
   * Get end date for ristourne
   * @returns string | null
   */
  getLastBeginDate(): string | null{
    return localStorage.getItem('endDate');
  }

  /**
   * Set End date for ristourne calculs
   * @param fournisseur 
   */
  setActiveFournisseur(fournisseur: Fournisseur){
    if(fournisseur){
      localStorage.setItem('activeFournisseur', JSON.stringify(fournisseur));
    }else{
      console.warn("pas de date de fin")
    }
  }
  /**
   * Get end date for ristourne
   * @returns string | null
   */
  getActiveFournisseur(): Fournisseur | null{
    if(!localStorage.getItem('activeFournisseur')){
      return null
    }
    return JSON.parse(localStorage.getItem('activeFournisseur')!) as Fournisseur;
  }

  getDay(date: string){
    let d = getDate(date, true);
    if(d){
      return d.split("/",1);
    }
    return false;
  }

  openDateModal(type: string){
    if(type == 'fin'){
      this.ionModalDateFin.present();
    }

    if(type == 'debut'){
      this.ionModalDateDebut.present();
    }
  }

  async getRavitaillement(start: string, end: string){
    
    if(!start || !end){
      this.logger.log("Les date ne sont pas bien definies")
      return
    }

    if(!this.activeFournisseur || !this.activeFournisseur.id){
      this.logger.log("Les fournisseurs ne sont pas bien definis")
      return
    }

    let _active_point_vente = this.pointVenteSvc.getActivePointeVente();
    if(!_active_point_vente || !_active_point_vente.id){
      this.logger.log("Les Point de vente non defini ne sont pas bien definis")
      return
    }

    let debut = new Date(start).getTime();
    let fin = new Date(end).getTime();

    this.logger.warn('debut', debut);
    this.logger.warn('fin', fin);
    return await this.ravitaillementSvc.getListRavitaillementByDate(debut, fin , this.activeFournisseur.id, _active_point_vente.id);
  }

  async calculRistourne(){
    this.logger.log('this debut est ', this.debut);
    this.logger.log('this fin est ', this.end);
    if(this.debut && this.end ){
      let _ravitaillements = await this.getRavitaillement(this.debut, this.end);
      this.ristourne = sommeDesRistournes(_ravitaillements);
      this.logger.warn(this.ristourne, "Ls ristournes sont: ")
      this.ravitaillements = this.calculRistournePourTousRavitaillements(_ravitaillements);
      this.logger.log("Somme :", this.ravitaillements);
      if(this.ravitaillements.length){
        this.setLastBeginDate(this.debut);
        this.setActiveFournisseur(this.activeFournisseur);
      }
    }
  }

  async pointVenteChange(event: PointVente){
    await this.calculRistourne();
  }

  calculRistournePourTousRavitaillements(ravitaillements: Ravitaillement[]): Array<Ravitaillement & { ristourne: number, qte: number }> {
    let tab: Array<Ravitaillement & { ristourne: number, qte: number }> = [];

    for (const rav of ravitaillements) {
        let item: any = { ...rav, ristourne: 0, qte: 0 };

        if (rav.produits) {
            let produits: ProduitsRavitailles[] = JSON.parse(rav.produits);

            if (produits.length) {
                item.ristourne = sommeRistournesEtQuantitesParRavitaillement(produits).sommeRistourne;
                item.qte = sommeRistournesEtQuantitesParRavitaillement(produits).sommeQuantites;
            }
        }

        tab.push(item);
    }

    return tab;
  }

  ViewDetails(rav: Ravitaillement & { ristourne?: number, qte?: number }){
    // conversion en type ravitaillement avant l'envois
    let { ristourne, qte, ..._rav } = rav;
    this.ravSvc.ravitaillement = _rav as Ravitaillement;
    this.router.navigateByUrl("/ravitaillement-confirmation-step/view_update");
  }
}
