import { Component, OnInit } from '@angular/core';
import { SyncDatabaseService } from 'src/app/services/backup.service';

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
    let databaseIsUpdate: boolean = await this.backupDatabase();
    console.log(databaseIsUpdate);
    await this.backupImages();
  }

  async backupDatabase(): Promise<boolean> {
    this.info = "Analyse et chargement de la base de données";
    return new Promise((resolve, reject) => {
      this.backupSvc.uploadDatabase().subscribe({
        next: (val) => {
          // if (val.index && val.total) {
          //   this.imageBuffer = parseInt(val.chunkIndex, 10) + 1;
          // }
          console.log(val);
          console.log("je suis sorti")
          this.imageBuffer = 1;
          resolve(true); // Resolve the promise on success
          // if(val.index + 1 == val.total){
          // }
        },
        error: (err) => {
          console.log(err);
          reject(false); // Reject the promise on error
        }
      });
    });
  }
  info: string = "" // information d'etat
  async backupImages(){
    this.info = "Recherche et analyse des données";
    this.backupSvc.uploadImages().subscribe({
      next: (val) => {
        if(val && val.index && val.total){
          let index: number = parseInt(val.index, 10) + 1;
          this.databaseBuffer = index;
          console.log(this.databaseBuffer)
          this.info = val.fieldName;
        }

        if(val.index == val.total){
          setTimeout(()=>{
            this.info = "Validé";
          }, 1500);
        }
        
        console.log(val);
        
      },
      error: (err) => console.log(err)
    })
  }

}
