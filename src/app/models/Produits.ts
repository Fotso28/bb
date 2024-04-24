export class Produit{
  public fournisseurs: string = "";
    constructor(
      public nom: string,
      public user_id?: number,
      public prixA?: number,
      public prixV?: number,
      public nbreBtleParCasier?: number,
      public ristourne?: number,
      public id_categorie?: string,
      public id_famille?: string,
      public id_casier?: string,
      public upload?: string,
      public imgLink?: string,
      public hasCasier?: boolean,
      public deletedAt?: number, // type timestamp
      public id?:number,
      ){
        this.deletedAt = 0;
        this.prixA = 0;
        this.ristourne = 0;
        this.nbreBtleParCasier = 0;
      }

      /**
       * Affecte à la variable fournisseurs la liste des founisseurs en mode String.
       * idéale pour être enregistré dans la base de donnée
       */
      set _fournisseurs(fournisseurs: {id: number, nom: string}[]){
        if(Object.keys(fournisseurs).length){
          this.fournisseurs = JSON.stringify(fournisseurs);
          return
        }
        this.fournisseurs = ""
      }

      /**
       * Retourne un tableau des fournisseurs du produit f: {id: number, nom: string}[]
       * 
       * @return {id: number, nom: string}[]
       */
      get _fournisseurs(): {id: number, nom: string}[] {
        return this.fournisseurs ? JSON.parse(this.fournisseurs) : {};
      }

      /**
       * retourne un tableau des IDs Fournisseurs de ce produit
       * 
       * @Return { id: number }[]
       */
      get _fournisseurs_ids(): number[]{
        return this.fournisseurs ? this._fournisseurs.map((four: {id: number, nom: string}) => four.id) : []
      }

      sayHello(){
        console.log('helo');
      }
}


 
  
 
  
 
 
 
  
 
 
 