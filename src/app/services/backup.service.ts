import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BdService } from './-bd.service';
import { catchError, forkJoin, from, Observable, of, switchMap, tap, map, zip, concat } from 'rxjs';
import { capSQLiteJson } from '@capacitor-community/sqlite';
import { Ravitaillement } from '../models/Ravitaillements';
import { Produit } from '../models/Produits';
import { Fournisseur } from '../models/Fournisseurs';
import { Employe } from '../models/Employes';
import { HistoriqueImageUploadedService } from './historique-image-uploaded.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { firstValueFrom } from 'rxjs';
import { User } from './user.service';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs/operators'; 
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SyncDatabaseService {
    private baseUrl = environment.apiUrl;

    constructor(private httpSvc: HttpService, private bdSvc: BdService, private http: HttpClient,
      private histoSvc: HistoriqueImageUploadedService){
        
      }

      /**
       * Recuperer les données dans la base de données en fonction de l'enregistrement 
       * dans Change_log
       * @param tableName :string
       * @returns Promise<any[] | undefined>
       */
      async getChange_log_table(tableName: string): Promise<any[] | undefined>{
        let sql = `SELECT c.action, c.table_name, c.record_id, t.*
        FROM change_log c
        JOIN ${tableName} t ON c.record_id = t.id
        WHERE c.table_name = '${tableName}'`
        let log_data = (await this.bdSvc.query(sql))?.values;
        return log_data;
      }
      /**
       * Retourne un JSON au format convenable pour le serveur
       * @param datas: any[] 
       * @returns return un JSON au format convenable pour le serveur
       */
      buildJSON_DATA(datas : any[] | undefined){
        console.log("datas", datas)
        if(!datas || !datas.length){
          throw Error("Paramètre mal defini")
        }

        return  {
          tableName: datas[0].table_name,
          changes: datas.map(row => {
              const { action, record_id, table_name, ...data } = row; // Séparer `action` et `record_id` des autres champs
              return {
                  action,
                  record_id,
                  data
              };
          })
        };
      }

      activeUser: any;
      async upload(data: Object){
        if(!this.activeUser){
          this.activeUser = await this.bdSvc.getActiveUser();
        }
        if(!this.activeUser || !this.activeUser.token){
          throw Error("L'utilisateur n'est mal defini");
        }
        return await this.httpSvc.post("/saveData", data, this.activeUser);
      }



















    

      uploadImages(): Observable<any> {
        console.log("au moins");
        return from(this.getAllImages()).pipe(
          switchMap((allImages) => 
            from(this.bdSvc.getActiveUser()).pipe(
              switchMap((user) => {
                if (!user) {
                  console.log("le user n'est pas valable");
                  return of(null);
                }
      
                if (!allImages.length) return of(null);
      
                const unsaved_images = allImages.filter((image) => !this.histoSvc.imageExist(image));
      
                if (!unsaved_images.length) return of(null);
      
                const params = new HttpParams().set('user_id', user.id.toString());
      
                const observables = unsaved_images.map((imageName, index) => 
                  from(this.loadImageFromMemory(imageName)).pipe(
                    switchMap((formData: FormData) => {
                      formData.append('index', index.toString());
                      formData.append('total', unsaved_images.length.toString());
                      formData.append('user_id', user.id.toString());
                      return this.http.post(`${this.baseUrl}/uploadImages`, formData, { params });
                    }),
                    tap(() => this.histoSvc.setHistorique(imageName)),
                    catchError((err) => {
                      console.log(err);
                      return of(null);
                    })
                  )
                );
      
                return concat(...observables);
              })
            )
          ),
          catchError((error) => {
            console.error('Erreur lors du téléchargement des images.', error);
            return of(false);
          })
        );
      }
      
 

    private async loadImageFromMemory(imageName: string): Promise<FormData>{
      try {
        const readResult = await Filesystem.readFile({
          path: imageName,
          directory: Directory.Data
        });
  
        // Convertir les données base64 en Blob
        const base64Response = await fetch(`data:image/jpeg;base64,${readResult.data}`);
        const blob = await base64Response.blob();
  
        // Préparer les données pour l'envoi
        const formData = new FormData();

        formData.append('file', blob, imageName);
        return formData
      } catch (error) {
        console.log(error);
        return <FormData>{}
      }
    }
    // Get all Ravitaillemnt
    private async getImageRavitaillement(): Promise<string[]> {
      return await this.getData<Ravitaillement>('Ravitaillement', 'photo_facture_url');
    }
    // Get all Produits
    private async getImageProduit(): Promise<string[]> {
      let image =  (await this.getData<Produit>('Produit', 'imgLink'));
      console.log(image);
      return image;
    }
    private async  getImageFournisseur(): Promise<string[]> {
      return await this.getData<Fournisseur>('Fournisseur');
    }
    private async  getImageEmploye(): Promise<string[]> {
      return await this.getData<Employe>('Employe');
    }

    private async getAllImages(): Promise<Array<string>>{
        let ravitaillemnt: string[] = await this.getImageRavitaillement();
        let produit: string[] = await this.getImageProduit();
        let partenaire: string[] = await this.getImageFournisseur();
        let employe: string[] = await this.getImageEmploye();
        
        let imageName = [...ravitaillemnt, ...produit, ...partenaire, ...employe].filter(Boolean);
        // 
        console.log(imageName);
        return imageName;
    }
    private async getData<T>(tableName: string, imgLink = "photo"): Promise<string[]> {
      try {
        let nullEmployeImageValue: string = '[]';
        let result = await this.bdSvc.query(`SELECT ${imgLink} as imageName FROM ${tableName}`);
        
        if ( Array.isArray(result.values) && result?.values.length) {
          console.log(result.values);
          return result.values.map((prod: { imageName: string }) => prod.imageName).filter((imageName: string) => imageName && !/preconfig-/.test(imageName) && imageName != nullEmployeImageValue) as string[];
        } else {
          return [];
        }
      } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        return [];
      }
    }

    async delete_log_entry(id:number[]){
      return await this.bdSvc.deleteLog(id);
    }
}
