import { FormGroup } from "@angular/forms";
import { ToastController } from "@ionic/angular";

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

  export async function showToast(message: string, type: "success" | "danger" = "success"){
    const toastCtrl = new ToastController();
    let toast = await toastCtrl.create({
      message: message,
      duration: 2000,
      position: "bottom",
      icon: "home",
      mode: 'ios',
      color: type,
    });
    await toast.present()
  }

  export function addToArray(arr: Array<any>, item: any){
    const index = arr.findIndex(elt => item.id === elt.id);
    if(index === -1){
      arr.push(item);
    }else{
      arr[index] = item;
    }
    return arr;
  }
