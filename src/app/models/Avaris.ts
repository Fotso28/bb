import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('Avaris')
export class Avaris{
    public updatedAt!: number;
    public createdAt!: number;
    public deletedAt!: number;
    public all_ready_inventoried!: boolean;
    constructor(
      public produit_id?: number,
      public qte?: number,
      public description?: string,
      public date?: number,
      public user_id?: number,
      public point_vente_id?: number,
      public id?:number,
      public produit_nom? : string
      ){
        this.qte = 0;
      }
}




 
  

  
