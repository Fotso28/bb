import { inject } from "@angular/core";
import { ClassName } from "../_decorators/class-name.decorator";
import { PointVenteService } from "../services/point-vente.service";

@ClassName('Reste')
export class Reste{
    
    constructor(public date: number, public produits: string, public user_id?: number, public id_point_vente?: number,
        public ids_ravitaillement?: string, public id?: number, public type: 'sto_update' | 'sto' = 'sto'){}

    
  }