import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, GalleryImageOptions, GalleryPhoto, GalleryPhotos, Photo} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private fileName = "Images/"  
  constructor(){}

  async readPhoto(fileName: string){
    const readFile = Filesystem.readFile({
      path: fileName,
      directory: Directory.Data
    });
    return readFile;
  }

  async takePhoto(source: string = "Photos"): Promise<ImageStruct | null> {
    try {
      const cameraSource: CameraSource = CameraSource[source as keyof typeof CameraSource];
      // Demander la permission d'utiliser la caméra si elle n'est pas encore accordée
      const cameraPermission = await Camera.checkPermissions();
      if (!cameraPermission.camera) {
        await Camera.requestPermissions();
      }

      // Prendre une photo en utilisant la caméra arrière (CameraSource.Camera) et spécifier le type de résultat (Jpeg)
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: cameraSource,
        allowEditing: false,
        width: 500,
        height: 500,
        quality: 80
      });

      // Vérifier si nous sommes en mode hybride (sur appareil mobile) ou non (sur navigateur)
      
        // Convertir l'image en ArrayBuffer pour faciliter l'envoi via Socket.io
        let arrayBuffer = await this.convertPhotoToBlob(photo.webPath!);
        console.log('taille non compressé', arrayBuffer!.byteLength);

        console.log("debut de la convertion");
        arrayBuffer = await this.reduireImage(arrayBuffer!, 1080 , 1080, );
        console.log("fin de la convertion");
        
        return { photo, arrayBuffer };
      
    } catch (error) {
      console.error('Erreur lors de la prise de la photo :', error);
      return null;
    }
  }

  

  // Convertir un fichier local en ArrayBuffer
  private async convertPhotoToBlob(photoPath: string): Promise<ArrayBuffer | null> {
    const response = await fetch(photoPath);
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    } else {
      console.error('Impossible de charger l\'image locale :', response.status);
      return null;
    }
  }


  async reduireImage(imageBuffer: ArrayBuffer, maxWidth: number, maxHeight: number): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;

        canvas.width = width;
        canvas.height = height;

        ctx!.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as ArrayBuffer);
          };
          reader.readAsArrayBuffer(blob!);
        }, 'image/jpeg', 0.7); // Vous pouvez ajuster la qualité ici
      };

      const blob = new Blob([new Uint8Array(imageBuffer)]);
      img.src = URL.createObjectURL(blob);
    });
  }

  async saveImageToMemory(photo: Photo): Promise<{filepath:string, webviewPath: string}>{
  
      let imageName = Date.now() + '.jpeg'
      // Convert photo to base64 format, required by Filesystem API to save
      const base64Data = await this.readAsBase64(photo);
      
      const savedFile = await Filesystem.writeFile({
        path: imageName,
        data: base64Data,
        directory: Directory.Data
      });

      // this.storageSvc.set(imageName, base64Data);

      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: imageName,
        webviewPath: photo.webPath!
      };
  }
  
  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  getImageDimensions(base64Data: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
      const image = new Image();
    
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        resolve({ width, height });
      };

      image.onerror = (error) => {
        reject(error);
      };

      image.src = 'data:image/jpeg;base64,' + base64Data; // Modifier le type d'image si nécessaire
    });
  }


  async pickImages(): Promise<GalleryPhotos> {
    try {

      
      const allowedMimeTypes = ['image/jpeg', 'image/png']; // Types MIME autorisés
  
      const galleryPhotos = await Camera.pickImages({
        quality: 80,
        height: 500,
        width: 500,
        limit: 6,
        presentationStyle: 'popover',
        
      });
  
      return galleryPhotos;
    } catch (error) {
      throw new Error('Erreur lors de la sélection des images depuis la galerie : ' + error);
    }
  }
}

export interface ImageStruct 
{
  photo: Photo;
  arrayBuffer: ArrayBuffer;
}


