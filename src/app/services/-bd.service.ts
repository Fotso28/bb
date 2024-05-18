import { Injectable, signal } from '@angular/core';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection} from '@capacitor-community/sqlite';
import { UserService } from './user.service';



const DB_NAME = "Db_Gbar";
export const NON_DELETE_VALUE = 0;
@Injectable({
  providedIn: 'root'
})
export class BdService{
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  private database_tables : Array<string> = [PRODUIT_RAVITAILLES, FAMILLE_TABLE, CASIER_SUP_TABLE, HISTORIQUE_TABLE, AVARIS_TABLE, CASIER_TABLE, CATEGORIE_TABLE, EMPLOYE_TABLE, FOURNISSEUR_TABLE,
     POINT_VENTE_TABLE, PRODUIT_TABLE, DEPENSE_TABLE, RAVITAILLEMENT_TABLE, VENTE_TABLE, TABLE_RESTE];
  

  private user = signal<any>([]);

  constructor(private userSvc: UserService) {}

  async initDatabase() : Promise<boolean>{
    try {

      this.db = await this.initConnection();
      await this.openConnection();
      // await this.db.query('drop table Vente');
      // let column = await this.db.query(`PRAGMA table_info(Produit)`);
      // console.log(column);
      let tableList = await this.db.getTableList();
      console.log(tableList);
      // console.log(this.db);
      await this.loadOrCreateTable();

      // this.closeConnection();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async query(sql: string, paranoidSelectQuery: boolean = false){
    return await this.db.query(sql);
  }

  async loadOrCreateTable(): Promise<void>{
    this.database_tables.forEach((table:string)=>{
      if(this.db){
        this.db.query(table).then((result: any) => {
        }).catch((err:any) => console.log(err));
      }else{
        console.log("db n'est pas initialisé")
      }
    })
  }
  async initConnection(): Promise<SQLiteDBConnection> {
    this.ensureConnectionIsOpen();

    const retCC = (await this.sqlite.checkConnectionsConsistency()).result;
    let isConn = (await this.sqlite.isConnection(DB_NAME, true)).result;

    let db!: SQLiteDBConnection;
    if(retCC && isConn) {
      db = await this.sqlite.retrieveConnection(DB_NAME, true);
    }else{
      db = await this.sqlite.createConnection(DB_NAME,false, "no-encryption", 1, false);
    }
    
    if ( db == null ) {
      throw new Error(`no db returned is null`);
    }
    return db;
  }

  async openConnection(): Promise<void>{
    this.ensureConnectionIsOpen();
    await this.db.open()
  }

  closeConnection(){
    this.ensureConnectionIsOpen();
    this.sqlite.closeConnection(DB_NAME, false);
  }

  private ensureConnectionIsOpen() {
    if ( this.sqlite == null ) {
        throw new Error(`no connection open`);
    }
  }

  async read(tableName: string, id: number): Promise<any> {
    
    const selectSQL = `SELECT * FROM ${tableName} WHERE id = ? AND deletedAt = ${NON_DELETE_VALUE}`;
    return (await this.db.query(selectSQL, [id])).values?.reverse();
  }

  async readAll(tableName: string, constraint: string = ""): Promise<any> {
    const selectSQL = `SELECT * FROM ${tableName} WHERE deletedAt = ${NON_DELETE_VALUE} ${constraint}`;
    return (await this.db.query(selectSQL)).values?.reverse();
  }
 /**
  * @param tableName 
  * @param data 
  * @param deep nombre de table de la transaction
  * @return boolean
  */
  public async create(data: any):Promise<boolean>{
    try {

      data.user_id = this.userSvc.getActiveUser()?.id;
      
      if(!data.user_id) throw new Error("None of the users are defined");
      
      let table_fields = Object.keys(data);
      let table_values = Object.values(data);
      let table_name = data.constructor.name;

      console.log("dans le service bd, voici la valeur du des champs", table_fields)
      console.log("dans le service bd, voici les", table_values)
      console.log("la type de la tableName", data)

      if(table_name == 'Object'){
        console.log("le type de donnée n'est pas conforme");
        return false
      }

      

      let create_sql = `INSERT INTO ${table_name} (${table_fields.join(', ')}) VALUES (${Array(table_fields.length).fill('?').join(', ')})`;
      let backup_sql = `INSERT INTO Historique (data_id, action_query, date) VALUES ( ? ,?, ?)`;
      await this.db.query(create_sql, table_values);
      // const last_insert_rowid: any = await this.db.query(`SELECT last_insert_rowid() as id FROM ${table_name}`);
      // console.log(last_insert_rowid);
      // await this.db.query(backup_sql, [7, "INSERT", Date.now()])
      console.log("je suis ici");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } 
  }

   /**
  * @return boolean
  * @param tableName 
  * @param data 
  */
   public async update(data: any): Promise<boolean>{
    try {
      let table_fields = Object.keys(data);
      let table_values = Object.values(data);
      let table_name = data.constructor.name;

      if(table_name == 'Object'){
        console.log("le type de donnée n'est pas conforme");
        return false
      }
      console.log(table_fields);
      console.log(table_values);
      console.log(data?.id);
      let update_sql = `UPDATE ${table_name} SET ${table_fields.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;
      await this.db.query(update_sql, [...table_values, data?.id]);
      // const last_insert_rowid: any = await this.db.query(`SELECT last_insert_rowid() as id FROM ${table_name}`);
      // console.log(last_insert_rowid);
      // await this.db.query(backup_sql, [7, "INSERT", Date.now()])
      return true
    } catch (error) {
      console.log(error);
      return false;
    } 
  }

  async delete(data: any): Promise<boolean> {
    try {
      let table_name = data.constructor.name;
      
      if(data.hasOwnProperty('deletedAt')){
        /// do not delete the element
        data.deletedAt = Date.now();
        this.update(data);
        return true;
      }
      const deleteSQL = `DELETE FROM ${table_name} WHERE id = ?`;
      await this.db.query(deleteSQL, [data.id]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

 
}



// let toto = await this.db.query("INSERT INTO Famille (nom, description) VALUES (?, ?)  ", ['toto',"je suis la description"], false)
//       let toto2 = await this.db.query("INSERT INTO User (nom, prenom) VALUES (?, ?)", ['Oswald',"Marie"], false);

const HISTORIQUE_TABLE = `CREATE TABLE IF NOT EXISTS Historique (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_id INTEGER,
  action_query TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  point_vente_id INTEGER NOT NULL,
  date DATETIME NOT NULL
)`;
const AVARIS_TABLE = `CREATE TABLE IF NOT EXISTS Avaris (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  qte INTEGER DEFAULT 0,
  description TEXT DEFAULT NULL,
  produit_id INTEGER,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL,
  point_vente_id INTEGER NOT NULL,
  deletedAt TIMESTAMP DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (produit_id) REFERENCES Produit(id)
)`;

const FAMILLE_TABLE = `CREATE TABLE IF NOT EXISTS Famille (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT,
  user_id INTEGER NOT NULL,
  deletedAt TIMESTAMP DEFAULT 0
)`;
// const USER_TABLE  = `CREATE TABLE IF NOT EXISTS User (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   nom TEXT NOT NULL,
//   prenom TEXT DEFAULT NULL,
//   mail TEXT,
//   adresse TEXT,
//   cni TEXT
// )`;
const PRODUIT_TABLE = `CREATE TABLE IF NOT EXISTS Produit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  qte INTEGER DEFAULT 0,
  prixA INTEGER DEFAULT 0,
  prixV INTEGER DEFAULT 0,
  nbreBtleParCasier INTEGER DEFAULT 0,
  ristourne INTEGER DEFAULT 0,
  id_categorie INTEGER NOT NULL,
  id_casier INTEGER,
  id_famille INTEGER,
  fournisseurs TEXT,
  upload TEXT,
  imgLink TEXT,
  hasCasier BOOLEAN DEFAULT 1,
  user_id INTEGER NOT NULL,
  deletedAt TIMESTAMP DEFAULT 0
)`;
const POINT_VENTE_TABLE = `CREATE TABLE IF NOT EXISTS PointVente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT,
  adresse TEXT,
  user_id INTEGER NOT NULL,
  deletedAt TIMESTAMP DEFAULT 0
)`;
const FOURNISSEUR_TABLE = `CREATE TABLE IF NOT EXISTS Fournisseur (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  adresse TEXT,
  phone1 TEXT,
  photo TEXT,
  collecte_ristourne BOOLEAN DEFAULT 1,
  user_id INTEGER NOT NULL,
  deletedAt TIMESTAMP DEFAULT 0
)`;
const EMPLOYE_TABLE = `CREATE TABLE IF NOT EXISTS Employe (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  adresse TEXT,
  phone1 TEXT NOT NULL,
  cni TEXT,
  photo TEXT,
  user_id INTEGER NOT NULL,
  deletedAt TIMESTAMP DEFAULT 0
)`;
const CATEGORIE_TABLE = `CREATE TABLE IF NOT EXISTS Categorie (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  deletedAt TIMESTAMP DEFAULT 0
)`;

const CASIER_TABLE = `CREATE TABLE IF NOT EXISTS Casier ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  nbre_btle_par_casier INTEGER NOT NULL, 
  nom TEXT NOT NULL, 
  description TEXT, 
  user_id INTEGER NOT NULL,
  deletedAt TIMESTAMP DEFAULT 0
  )`;

  const DEPENSE_TABLE = `CREATE TABLE IF NOT EXISTS Depense ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    date TIMESTAMP NOT NULL, 
    type TEXT, 
    motif TEXT,
    montant INTEGER NOT NULL, 
    user_id INTEGER NOT NULL,
    point_vente_id INTEGER NOT NULL,
    deletedAt TIMESTAMP DEFAULT 0
    )`;

  const RAVITAILLEMENT_TABLE = `CREATE TABLE IF NOT EXISTS Ravitaillement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date INTEGER,
    num_facture TEXT,
    user_id INTEGER NOT NULL,
    id_point_vente INTEGER,
    total REAL,
    dette REAL,
    montant_verse REAL,
    nom_fournisseur TEXT,
    id_fournisseur INTEGER,
    can_update INTEGER,
    produits TEXT NOT NULL,
    casiers TEXT,
    photo_facture_url TEXT,
    deletedAt TIMESTAMP DEFAULT 0,
    all_ready_inventoried INTEGER DEFAULT 0,
    FOREIGN KEY (id_fournisseur) REFERENCES Fournisseur(id),
    FOREIGN KEY (id_point_vente) REFERENCES PointVente(id)
)`;

  const VENTE_TABLE = `CREATE TABLE IF NOT EXISTS Vente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    versement DECIMAL(10, 2),
    ids_employe INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    id_point_vente INTEGER NOT NULL,
    deletedAt TIMESTAMP DEFAULT 0,
    produits TEXT,
    ids_ravitaillement TEXT
);`; 

const CASIER_SUP_TABLE = `CREATE TABLE IF NOT EXISTS CasierSup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK (type IN ('E', 'S')),
  nbre_bouteille INTEGER,
  id_casier INTEGER,
  user_id INTEGER,
  FOREIGN KEY (id_casier) REFERENCES Casier(id)
)`;

const PRODUIT_RAVITAILLES = `CREATE TABLE IF NOT EXISTS produits_ravitailles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_ravitaillement INTEGER,
  num_facture TEXT,
  id_produit INTEGER,
  nom_produit TEXT,
  user_id INTEGER,
  qte INTEGER,
  date INTEGER,
  updatedAt INTEGER,
  createdAt INTEGER,
  point_vente_id INTEGER
);`;

const TABLE_RESTE = `CREATE TABLE IF NOT EXISTS Reste (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  user_id INTEGER NOT NULL,
  id_point_vente INTEGER NOT NULL,
  produits TEXT,
  deletedAt TIMESTAMP DEFAULT 0,
  ids_ravitaillement TEXT
)`; 