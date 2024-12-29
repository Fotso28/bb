import { Component, OnInit } from '@angular/core';
import { SyncDatabaseService } from 'src/app/services/backup.service';
import {of, retry} from "rxjs";
import { DATABASE_TABLENAME } from 'src/app/services/-bd.service';
@Component({
  selector: 'app-trigger-sauvegarde',
  templateUrl: './trigger-sauvegarde.page.html',
  styleUrls: ['./trigger-sauvegarde.page.scss'],
})
export class TriggerSauvegardePage implements OnInit {
  public databaseBuffer = 0;
  public imageBuffer = 0;
  constructor(private backupSvc: SyncDatabaseService) { }

  async ngOnInit() {
    this.info = "Analyse et chargement de la base de données";
    if(DATABASE_TABLENAME.length){
      DATABASE_TABLENAME.forEach(async (tableName: string) => {
        this.info = tableName;
        let log_data = await this.backupSvc.getChange_log_table(tableName);
        if(log_data?.length){
          let datas = this.backupSvc.buildJSON_DATA(log_data);
          console.log(datas);
          let result = await this.backupSvc.upload(datas);
          console.log("result est : ", result);
          console.log("result est : ", log_data);
          if(result.state == 201){
            const ids = log_data.map((item) => item.id).filter(Boolean);
            console.log(ids);
            await this.backupSvc.delete_log_entry(ids);
          }
        }
    });

    this.databaseBuffer = 1
  }

    
  this.info = "Analyse et chargement de la base de données";
  await this.backupImages();
  this.imageBuffer = 1
}

  info: string = "" // information d'etat
  async backupImages(){
    this.info = "Recherche et analyse des données";
    this.backupSvc.uploadImages().subscribe({
      next: (val) => {
        if(val && val.index && val.total){
          let index: number = parseInt(val.index, 10) + 1;
          let total: number = parseInt(val.total, 10);
          this.databaseBuffer = +(index/total).toFixed(1);
          console.log(this.databaseBuffer)
          this.info = val.fieldName;
        }

        if(val && val.index == val.total){
          setTimeout(()=>{
            this.databaseBuffer = 1;
            this.info = "donnée sauvegardées";
          }, 1500);
        }
        console.log(val);
        // au cas ou il n'y a pas d'image
        if(!val){
          this.databaseBuffer = 1;
          this.info = "Sauvegarde terminée";
        }
        
      },
      error: (err) => console.log(err)
    })
  }

}
