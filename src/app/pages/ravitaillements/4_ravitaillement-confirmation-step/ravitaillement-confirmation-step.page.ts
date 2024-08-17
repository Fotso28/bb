import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { Photo } from '@capacitor/camera';
import { ActionSheetButton, ActionSheetController, NavController } from '@ionic/angular';
import { getDate, showError, showToast } from 'src/app/_lib/lib';
import { PointVente } from 'src/app/models/PointVentes';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { CameraService } from 'src/app/services/camera.service';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-ravitaillement-confirmation-step',
  templateUrl: './ravitaillement-confirmation-step.page.html',
  styleUrls: ['./ravitaillement-confirmation-step.page.scss'],
})
export class RavitaillementConfirmationStepPage implements OnInit {

  ravitaillement!: Ravitaillement;
  casiers: any[] = [];
  produits: ProduitsRavitailles[] = [];

  action!: 'add' | 'view_update' | undefined; // action to do on page
  constructor( private navCtrl: NavController,
    public ravSvc: RavitaillementService, 
    public router: Router,
    private actionSheetCtrl: ActionSheetController, 
    public pvSvc: PointVenteService,
    private route: ActivatedRoute, 
    private cameraSvc: CameraService) { }

  async ngOnInit() {
  }

  prev(){
    this.navCtrl.navigateBack("/ravitaillement-emballage-step")
  }
  activePointVente: PointVente = <PointVente>{};
  async ionViewWillEnter(){
    this.action = (this.route.snapshot.paramMap.get('action')) as 'add' | 'view_update' | undefined;
    this.ravitaillement = this.ravSvc.getRavitaillementInstance();
    console.log(this.ravitaillement);
    await this.pvSvc.getAll();
    this.pvSvc.pointVenteSubject.subscribe({
      next: (pv: PointVente[]) => {
        console.warn(pv)
        let pointVente: PointVente[] = pv.filter((pv: PointVente) => pv.id == this.ravitaillement.id_point_vente);
        if(pointVente.length){
          this.activePointVente = pointVente[0];
          console.warn(this.activePointVente)
        }else{
          showError("point de vente non defini");
        }
      },
      error: (err) => console.log(err)
    })
    this.casiers = this.getCasiers(this.ravitaillement);
    this.produits = this.getProduits();
    console.log(this.ravitaillement);
  }

  async save(){
    try {
     
      let role = await this.confirm();

      if(role == 'cancel'){
        return;
      }
      
      if(!this.route){
        showError("Erreur avec les routes");
        return;
      }
      
      if(this.ravSvc.photo_facture){
        let path = await this.saveImage(this.ravSvc.photo_facture);
        this.ravSvc.getRavitaillementInstance().photo_facture_url = path.webviewPath;
      }

      if(this.action == "add"){
        await this.ravSvc.save();
        this.ravSvc.clearRavitaillement();
        showToast("Ravitaillement Enregistré", "success");
      }

      this.router.navigateByUrl("/list-ravitaillement")
    } catch (error) {
      showError("Une erreur s'est produite")
    }
  }

  getDate(): false | string{
    if(this.ravitaillement.date){
      return getDate(this.ravitaillement.date)
    }
    return false;
  }

  getProduits(): Array<ProduitsRavitailles>{
    if(this.ravitaillement?.produits){
      return JSON.parse(this.ravitaillement?.produits)
    }
    return [];
  }

  getNbreCasiers(prod: ProduitsRavitailles){
      if(!prod.nbreBtleParCasier){
        showError("Nombre de casier indefini")
        return
      }
      if(!prod.qte_btle){
        showError("Nombre de casier indefini")
        return
      }
      console.log(prod)
      return Math.floor(prod.qte_btle / prod.nbreBtleParCasier)
  }

  getNbreBouteilleSupplementaire(prod: ProduitsRavitailles){
    if(!prod.nbreBtleParCasier){
      showError("Nombre de casier indefini")
      return
    }
    if(!prod.qte_btle){
      showError("Nombre de casier indefini")
      return
    }
    return prod.qte_btle % prod.nbreBtleParCasier
  }

  getCasiers(ravitaillement: Ravitaillement): any[]{
    if(!ravitaillement.casiers){
      showError("Casier indefini")
      return []
    }
    let casiers = JSON.parse(ravitaillement.casiers);
    return casiers
  }

  showTooltip(msg: string){
    showToast(msg, 'primary', 'information-circle-outline')
  }

  async saveImage(photo: Photo): Promise<{filepath: string, webviewPath: string}>{
    return await this.cameraSvc.saveImageToMemory(photo);
  }

  image_facture_url(){
    console.log(this.ravSvc.getRavitaillementInstance())
    if(this.ravSvc.getRavitaillementInstance().photo_facture_url){
      return this.ravSvc.getRavitaillementInstance().photo_facture_url
    }
    if(this.ravSvc.photo_facture?.webPath){
      return this.ravSvc.photo_facture.webPath
    }
    return ""
  }
  // When we go from list of ravitaillement to view. 
  // After comme back we have to clear ravitaillementElement.
  /**
   * ceci evite qu'en revenant sur la page 1/4 que les champs soient pre-remplis
   */
  ionViewWillLeave(){
    console.log("je veux partir", "ici")
    if(this.action != 'add'){
      this.ravSvc.clearRavitaillement();
    }
  }


  async confirm(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Enregistrer un nouveau ravitaillement ?',
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
  
}
