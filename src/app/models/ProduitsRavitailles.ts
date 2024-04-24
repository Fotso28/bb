export class ProduitsRavitailles{
    constructor( 
      public id: number,
      public prixA: number,
      public prixV: number,
      public nbreBtleParCasier: number,
      public nom: string,
      public qte_btle?: number,
      public ristourne?: number,
      public famille?: string,
      public categorie?: string,
      public fournisseurs?: Array<string>
      ){
        this.qte_btle = 0;
      }
}