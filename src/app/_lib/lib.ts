import { FormGroup } from "@angular/forms";
import { ActionSheetController, LoadingController, ToastController } from "@ionic/angular";
import { ProduitsRavitailles } from "../models/ProduitsRavitailles";
import { Ravitaillement } from "../models/Ravitaillements";
import { Vente } from "../models/ProduitVendus";

export function resetForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.setValue(''); // Réinitialise la valeur du champ à une chaîne vide
        control.markAsPristine(); // Marque le champ comme "pristine"
        control.markAsUntouched(); // Marque le champ comme "untouched"
      }
    });
  }

  export async function showToast(message: string, type: "success" | "danger" | "light" | "warning" | "primary" = "success", icon: string|undefined = undefined){
    const toastCtrl = new ToastController();
    let toast = await toastCtrl.create({
      message: message,
      duration: 2000,
      position: "bottom",
      icon,
      mode: 'ios',
      color: type,
      cssClass: "custom-toast"
    });
    await toast.present()
  }

  //
  export function addToArray(arr: Array<any>, item: any){
    
    const index = arr.findIndex(elt => item.id === elt.id);
    if(index === -1){
      arr.push(item);
    }else{
      arr[index] = item;
    }
    return arr;
  }

  export function showError(error:any){
    let err: string;
    if(typeof error !== "string"){
      err = JSON.stringify(error)
    }else{
      err = error;
    }
    showToast(err, "danger");
    console.log(error)
  }

  export function toTimestamp(time: string){
    return (new Date(time)).getTime();
  }

  /***
   * Somme un tableau de tableau de produits ravitailles
   */
  export function sommeArrayProduits(arr: ProduitsRavitailles[][]): ProduitsRavitailles[] {
    try {
      const productMap: { [id: number]: ProduitsRavitailles } = {};
      arr.forEach(subArray => {
        subArray.forEach(product => {
          const { id, qte_btle, ...rest } = product;
          if (id && productMap[id]  && qte_btle != undefined) {
            productMap[id].qte_btle! += qte_btle;
          } else {
            productMap[id] = { id, qte_btle, ...rest };
          }
        });
      });
      return Object.values(productMap);
    } catch (error) {
      showError(error)
      return [];
    }
  }

  export function getDate(date: Date | number | string, normal: boolean = false): false | string {
    if (!date) {
      return false;
    }

    if(normal){
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long', // 'long' pour obtenir le nom complet du jour
      year: 'numeric', // 'numeric' pour l'année en 4 chiffres
      month: 'long', // 'long' pour le nom complet du mois
      day: 'numeric' // 'numeric' pour le jour du mois en nombre
    });
  }

  export async function showLoading() {
    let loadingCtrl = new LoadingController();
    const loading = await loadingCtrl.create({
      message: "Veuillez patienter",
      animated: false,
      mode: 'ios'
    });

    loading.present();
    return loading;
  }

  /**
   * Calcule la somme des ristournes
   * @param ravitaillements Ravitaillement[]
   * @returns number
   */
  export function sommeDesRistournes(ravitaillements: Ravitaillement[]): number | false {
    let totalRistourne = 0;
  
    for (const ravitaillement of ravitaillements) {
      if (ravitaillement.produits) {
        const produitsRavitailles: ProduitsRavitailles[] = JSON.parse(ravitaillement.produits);
        for (const produit of produitsRavitailles) {
          console.log(produit)
          if(!produit.ristourne && produit.ristourne != 0){
            return false;
          }
          if (produit.qte_btle && produit.nbreBtleParCasier) {
            totalRistourne += produit.ristourne * produit.qte_btle/produit.nbreBtleParCasier;
          }
          else{
            return false;
          }
        }
      }
    }
    return totalRistourne;
  }

  /**
   * calcule pour chaque Inventaire la quantité de produits, le montant total des ventes, et le montant total des achats
   * @param ventes Vente[]
   * @returns Array<{nom: string, somme_qte: number, prixAT: number, prixVT: number}>
   */
export function agregerProduitsDesVentes(ventes: Vente[]): Array<{nom: string, somme_qte: number, prixAT: number, prixVT: number}> {
  const produitsAggreges: { [key: string]: { 
    somme_qte: number, 
    prixA: number, 
    prixV: number, 
    nbreBtleParCasier: number }} = {};
    
  for (const vente of ventes) {
    if (vente.produits) {
      const produits: ProduitsRavitailles[] = JSON.parse(vente.produits);
      for (const produit of produits) {
        if (!produitsAggreges[produit.nom]) {
          produitsAggreges[produit.nom] = { somme_qte: 0, prixA: produit.prixA, prixV: produit.prixV, nbreBtleParCasier: produit.nbreBtleParCasier };
        }
        produitsAggreges[produit.nom].somme_qte += produit.qte_btle || 0;
      }
    }
  }

  return Object.keys(produitsAggreges).map(nom => ({
    nom: nom,
    somme_qte: produitsAggreges[nom].somme_qte,
    prixAT: produitsAggreges[nom].prixA * produitsAggreges[nom].somme_qte / produitsAggreges[nom].nbreBtleParCasier,
    prixVT: produitsAggreges[nom].prixV * produitsAggreges[nom].somme_qte / produitsAggreges[nom].nbreBtleParCasier
  }));
}

/**
 * 
 * @param produits_ravitailles 
 * @returns 
 */
export function sommeRistournesEtQuantitesParRavitaillement(produits_ravitailles: ProduitsRavitailles[]): { sommeRistourne: number, sommeQuantites: number } {
  return produits_ravitailles.reduce((acc, produit) => {
      if (produit?.ristourne && produit?.qte_btle && produit.nbreBtleParCasier) {
          acc.sommeRistourne += Math.floor(produit.qte_btle / produit.nbreBtleParCasier) * produit.ristourne;
      }
      if (produit?.qte_btle) {
          acc.sommeQuantites += Math.floor(produit.qte_btle / produit.nbreBtleParCasier);
      }
      return acc;
  }, { sommeRistourne: 0, sommeQuantites: 0 });
}

export function  trimAndParseInt(elt: any): number {
  // Supprime les espaces en début et en fin de la chaîne
  console.log(typeof elt, elt);
  
  const trimmedValue = elt.trim();
  
  // Supprime tous les caractères non numériques
  const cleanedValue = trimmedValue.replace(/\D+/g, '');

  // Convertit la chaîne nettoyée en nombre
  return cleanedValue ? parseInt(cleanedValue, 10) : 0;
}
export function markAllFieldsAsTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
    if (control instanceof FormGroup) {
      markAllFieldsAsTouched(control);
    }
  });
}

export async function confirmAlert(msg: string = 'Voulez vous supprimer cet image ?'){
  let actionSheetCtrl = new ActionSheetController();
  const actionSheet = await actionSheetCtrl.create({
    header: msg,
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

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

