import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('Famille')
export class Famille{
    constructor(
      public nom: string,
      public description?: string,
      public user_id?: number,
      public deletedAt?: number, // type timestamp
      public id?:number,
      ){
        this.deletedAt = 0;
      }
  }