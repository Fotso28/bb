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
import { User, UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class SyncDatabaseService {
    private baseUrl = 'https://e038-129-0-80-155.ngrok-free.app/api';

    constructor(private http: HttpClient, private bdSvc: BdService, private userSvc: UserService,
      private histoSvc: HistoriqueImageUploadedService){}

    uploadDatabase(): Observable<any> {
      let user: User | null = this.userSvc.getActiveUser();
      if(!user){
        console.log("le user n'est pas valable");
        return of(null);
      }
      return from(this.bdSvc.exportDatabase()).pipe(
        switchMap((data: capSQLiteJson) => {
          const jsonData = JSON.stringify(data);
          console.log(jsonData);
          const maxChunkSize = 1024; // 5 Mo en octets
          const totalSize = new Blob([jsonData]).size;
          const totalChunks = Math.ceil(totalSize / maxChunkSize);
          
          const headers = new HttpHeaders({
            "Content-Type": "application/json"
          });

          console.log("Backup est ceci : ", data);
          console.log("Taille totale de la data en octets : ", totalSize);
          console.log("Nombre de paquets nécessaires : ", totalChunks);

          let observables = [];
         
          for (let i = 0; i < totalChunks; i++) {
            const start = i * maxChunkSize;
            const end = Math.min(start + maxChunkSize, totalSize);
            const chunk = jsonData.slice(start, end);
            observables.push(this.http.post(`${this.baseUrl}/uploadDatabase`, 
              { 
                data: chunk,
                user_id: user?.id,
                chunkIndex: i+1,
                totalChunks
              }, 
              { headers }));
          }

          return forkJoin(observables);
        }),
        catchError(error => {
          console.error('Erreur lors de la lecture du fichier.', error);
          return of(false); // Retourne un Observable qui émet false
        })
      );
    }

    // async uploadImages(){
    //   let allImages = await this.getAllImages();
    //   if(!allImages.length) return;
    //   let unsaved_images: string[] = [] // Toutes les images pas encore envoyée sur le serveur
      
    //   let user: User | null = this.userSvc.getActiveUser();
    //   if(!user){
    //     console.log("le user n'est pas valable");
    //     return;
    //   }

    //   for(let i = 0; i< allImages.length; i++){
    //     if(!this.histoSvc.imageExist(allImages[i])){
    //       unsaved_images.push(allImages[i]);
    //     }
    //   }
    //   if(!unsaved_images.length) return;

    //   // Définir l'en-tête Content-Type avec le boundary
    //   const headers = new HttpHeaders({
    //     'Content-Type': `multipart/form-data`
    //   });
    //   console.log("les images non enregistrée sont: ", unsaved_images);
    //   unsaved_images.forEach(async (imageName, index) =>{
    //     let formData: FormData = await this.loadImageFromMemory(imageName);
    //     formData.append('index', index.toString());
    //     formData.append('total', unsaved_images.length.toString());
    //     formData.append('user_id', user.id.toString());
    //     firstValueFrom(this.http.post(this.baseUrl + "/uploadImages", formData)).then((val)=>{
    //       this.histoSvc.setHistorique(imageName);
    //       console.log(val);
    //     }).catch((err) => {
    //       console.log(err)
    //     })
    //   })
    // }

    uploadImages(): Observable<any> {
      let user: User | null = this.userSvc.getActiveUser();
      if (!user) {
        console.log("le user n'est pas valable");
        return of(null);
      }
    
      return from(this.getAllImages()).pipe(
        switchMap((allImages) => {
          if (!allImages.length) return of(null);
    
          let unsaved_images: string[] = []; // Toutes les images pas encore envoyées sur le serveur
    
          console.log(allImages);
          for (let i = 0; i < allImages.length; i++) {
            if (!this.histoSvc.imageExist(allImages[i])) {
              unsaved_images.push(allImages[i]);
            }
          }
          if (!unsaved_images.length) return of(null);
    
          console.log("les images non enregistrées sont: ", user!.id.toString());

          let params = new HttpParams()
          .set('user_id', user!.id.toString());
    
          // Création d'un observable de séquence pour envoyer les images une par une
          let observables = unsaved_images.map((imageName, index) => {
            return from(this.loadImageFromMemory(imageName)).pipe(
              switchMap((formData: FormData) => {
                formData.append('index', index.toString());
                formData.append('total', unsaved_images.length.toString());
                formData.append('user_id', user!.id.toString());
                return this.http.post(this.baseUrl + "/uploadImages", formData, { params });
              }),
              // tap(() => this.histoSvc.setHistorique(imageName)),
              catchError((err) => {
                console.log(err);
                return of(null); // Retourne un Observable qui émet null en cas d'erreur
              })
            );
          });
    
          // Utilisation de concat pour garantir l'envoi séquentiel
          return concat(...observables);
        }),
        catchError((error) => {
          console.error('Erreur lors du téléchargement des images.', error);
          return of(false); // Retourne un Observable qui émet false en cas d'erreur
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
      return (await this.getData<Produit>('Produit', 'imgLink'));
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
        
        let imageName = [...ravitaillemnt, ...produit, ...partenaire, ...employe];
        // 
        return imageName;
    }
    private async getData<T>(tableName: string, imgLink = "photo"): Promise<string[]> {
      try {
        let nullEmployeImageValue: string = '[]';
        let result = await this.bdSvc.query(`SELECT ${imgLink} as imageName FROM ${tableName}`);
        
    
        if (result.values && Array.isArray(result.values)) {
          return result.values.map((prod: { imageName: string }) => prod.imageName).filter((imageName: string) => imageName && !/^preconfig-/.test(imageName) && imageName != nullEmployeImageValue) as string[];
        } else {
          return [];
        }
      } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        return [];
      }
    }
}
