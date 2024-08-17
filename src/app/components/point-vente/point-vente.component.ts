import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonSelect, Platform } from '@ionic/angular';
import { PointVente } from 'src/app/models/PointVentes';
import { PointVenteService } from 'src/app/services/point-vente.service';

@Component({
  selector: 'app-point-vente',
  templateUrl: './point-vente.component.html',
  styleUrls: ['./point-vente.component.scss'],
})
export class PointVenteComponent  implements OnInit {

  pointVente!: PointVente[];
  activePv!: PointVente;
  pvForm!: FormGroup;
  @Input() color = "#222428"
  @Output() pointVenteEvent = new EventEmitter<PointVente>()
  @ViewChild('select', { static: false }) selectRef!: IonSelect;
  constructor(private platform: Platform, private pvSvc: PointVenteService, private formBuilder: FormBuilder){}
  
  async ngOnInit() {

    this.platform.ready().then(async () => {

      let _pointVente = await this.pvSvc.all();

      if(!_pointVente || !_pointVente.length){
        console.log("Aucun point de vente");
        return;
      } 

      console.log(_pointVente);
      let activePv = this.pvSvc.getActivePointeVente();
      let index = 0;
  
      if(!activePv && _pointVente && _pointVente.length){
        // index = _pointVente?.findIndex((pv: PointVente) => pv.id == activePv?.id);
        activePv = _pointVente[index];
      }
      this.pointVente = _pointVente;
      this.activePv = _pointVente[index];
      console.warn(this.activePv)
      this.pvForm = this.formBuilder.group({
        activePointVente: [ activePv || "" ]
      });
      
    })
   
  }

  async ionViewWillEnter(){}

  changePv(event: Event){
    this.pvSvc.setActivePointVente((event as CustomEvent).detail.value as PointVente);
    this.pointVenteEvent.emit((event as CustomEvent).detail.value as PointVente);
    this.activePv = (event as CustomEvent).detail.value as PointVente;
  }

  openModal(){
    this.selectRef.open()
  }

}
