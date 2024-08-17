import { Injectable, signal } from '@angular/core';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection, DBSQLiteValues, capSQLiteJson} from '@capacitor-community/sqlite';
import { UserService } from './user.service';
import { showToast } from '../_lib/lib';
import { DEFAULT_DATA } from '../_lib/default-data';



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

  


  async checkDatabaseExists(databaseName: string): Promise<boolean> {
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    try {
      const isDbExists = await sqlite.isDatabase(databaseName);
      return isDbExists.result as boolean;
    } catch (error) {
      console.error('Error while checking database existence:', error);
      return false;
    }
  }

  async initDatabase() : Promise<boolean>{
    try {

      this.db = await this.initConnection();
      await this.openConnection();
      // await this.db.query('drop table Historique');
      // let column = await this.db.query(`PRAGMA database_list`);
      // console.log(column.values && column.values[0].file);

      
      // await this.DropTables();
      
      await this.loadOrCreateTable();
      await this.insertItems(); 
      
      // this.closeConnection();
      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
      return Promise.reject(false);
    }
  }

  async DropTables(){
    let tableList: any = await this.db.getTableList();
    console.log(tableList);
    const insertPromises = await tableList.values.map(async (item: any) => {
      console.log(item)
      return await this.db.query('drop table if exists '+item);
    });
    // Execute all insert operations in parallel
    await Promise.all(insertPromises);
  }

  getDb(){
    return this.db
  }

  async query(sql: string, paranoidSelectQuery: boolean = false, value: Array<any> = []){
    return await this.db.query(sql, value);
  }

  async isFirst(): Promise<boolean>{
    // if(await this.checkDatabaseExists(DB_NAME)){
    //   return false;
    // }
    let result = await this.query("Select * from Produit");
    console.log("le resultat est :", !result.values?.length)
    return !!result.values?.length;
  }

  async loadOrCreateTable(): Promise<void>{
    this.database_tables.forEach((table:string)=>{
      if(this.db){
        this.db.query(table).then((result: any) => {
          // console.log(result);
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
    
    try {

      // let _pv: PointVente | null = this.pvSvc.getActivePointeVente();
      // if(!_pv || !_pv.id){
      //   return null;
      // }

      const selectSQL = `SELECT * FROM ${tableName} 
        WHERE id = ? AND deletedAt = ${NON_DELETE_VALUE}`;
      let  _result =  (await this.db.query(selectSQL, [id])).values;
      if(_result?.length){
        return _result[0]
      }
      else{
        return null
      }
    } catch (error) {
      console.log(error)
    }
  }

  async readAll(tableName: string, constraint: string = ""): Promise<any> {
    try {
      let count = 0;
      while(!this.db && count < 30){
        await this.delay(50);
        count++;
        console.warn(count)
      }
      if(count == 30){
        showToast("base de donnée non initialisée!", "danger")
      }
      const selectSQL = `SELECT * FROM ${tableName} WHERE deletedAt = ${NON_DELETE_VALUE} ${constraint}`;
      return (await this.db.query(selectSQL)).values?.reverse();
    } catch (error) {
      console.log(error)
    }
  }
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
 /**
  * @param tableName 
  * @param data 
  * @param deep nombre de table de la transaction
  * @return boolean
  */
  public async create(data: any, returnSaveValue=false):Promise<false | DBSQLiteValues>{
    try {

      data.user_id = this.userSvc.getActiveUser()?.id;
      
      if(!data.user_id) throw new Error("None of the users are defined");
      
      if(Object.keys(data).includes('deletedAt')){
        data.deletedAt = 0;
      }

      let table_fields = Object.keys(data);
      let table_values = Object.values(data);
      let table_name = data.className;

      console.log("dans le service bd, voici la valeur du des champs", table_fields)
      console.log("dans le service bd, voici les", table_values)
      
      if(table_name == 'Object'){
        console.log("le type de donnée n'est pas conforme");
        return false
      }

      

      

      let create_sql = `INSERT INTO ${table_name} (${table_fields.join(', ')}) VALUES (${Array(table_fields.length).fill('?').join(', ')})`;
      
      let _newval = await this.db.query(create_sql, table_values);
      // const last_insert_rowid: any = await this.db.query(`SELECT last_insert_rowid() as id FROM ${table_name}`);
      // console.log(last_insert_rowid);
      // await this.db.query(backup_sql, [7, "INSERT", Date.now()])
      console.log("je suis ici");
      if(returnSaveValue){
        return await this.db.query(`SELECT MAX(id) as id FROM ${table_name}`);
      }
      return _newval;
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

      data.user_id = this.userSvc.getActiveUser()?.id;
      if(!data.user_id) throw new Error("None of the users are defined");
      if(Object.keys(data).includes('deletedAt')){
        data.deletedAt = 0;
      }
      let table_fields = Object.keys(data);
      let table_values = Object.values(data);
      let table_name = data.className;

      if(table_name == 'Object'){
        console.log(data, "le type de donnée n'est pas conforme");
        return false
      }

      

      console.log(table_fields);
      console.log(table_values);
      console.log(data?.id);
      let update_sql = `UPDATE ${table_name} SET ${table_fields.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;
      console.log(update_sql);
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
      let table_name = data.className;
      
      if(data.hasOwnProperty('deletedAt')){
        /// do not delete the element
        // console.warn(data, "voici la data")
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

  async getLastId(tableName: string): Promise<number|false>{
    try {
      let _tmp = (await this.db.query("SELECT MAX(id) as id FROM Reste")).values
      if(!_tmp || !_tmp.length){
        return false;
      }
      return _tmp[0].id
    } catch (error) {
      return false;
    }
  }

  async insertItems() {
    
    try {
      // console.log(await this.checkDatabaseExists(DB_NAME))
      if((await this.isFirst())){
        console.warn("La base de donnée existe déjà");
        return; 
      }
      // if(await this.checkDatabaseExists(DB_NAME)){
      //   console.warn("La base de donnée existe déjà");
      //   // return;
      // }
      // await this.db.beginTransaction();
  
      // Insert new records
      for (const tableData of DEFAULT_DATA) {

        const insertQuery = `INSERT INTO ${tableData.table} (${Object.keys(tableData.values[0]).join(', ')}) VALUES (${Object.keys(tableData.values[0]).map(() => '?').join(', ')})`;
        // console.log("voici la table ", tableData.table)
        // await this.db.query(`DELETE FROM sqlite_sequence WHERE name=${tableData.table}`);
        // await this.db.query(`DELETE FROM ${tableData.table}`);

        console.log(`DELETE FROM ${tableData.table}`);
        // Prepare all insert operations as promises
        const insertPromises = tableData.values.map((item: any) => this.db.query(insertQuery, Object.values(item)));
  
        // Execute all insert operations in parallel
        await Promise.all(insertPromises);
      }
  
      // await this.db.commitTransaction();
      console.log('All items inserted successfully');
    } catch (error) {
      // await this.db.rollbackTransaction();
      console.error('Voici les erreurs', error);
    }
  }

  async deleteDatabase(): Promise<void> {
    this.ensureConnectionIsOpen();
    await this.sqlite.closeConnection(DB_NAME, false);
    await this.sqlite.deleteOldDatabases(DB_NAME);
    this.db = <SQLiteDBConnection>{};
    console.log(`Database ${DB_NAME} has been deleted.`);
  }

  async exportDatabase(): Promise<capSQLiteJson>{
    const result = await this.db.exportToJson("full");
    return result;
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
  produit_nom TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL,
  point_vente_id INTEGER NOT NULL,
  all_ready_inventoried INTEGER DEFAULT 0,
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
    id_reste INTEGER, 
    id_lastStock INTEGER,
    id_point_vente INTEGER NOT NULL,
    deletedAt TIMESTAMP DEFAULT 0,
    produits TEXT,
    ids_ravitaillement TEXT
)`; 

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
)`;

const TABLE_RESTE = `CREATE TABLE IF NOT EXISTS Reste (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  user_id INTEGER NOT NULL,
  id_point_vente INTEGER NOT NULL,
  produits TEXT,
  type TEXT CHECK(type IN ('sto_update', 'sto')),
  deletedAt TIMESTAMP DEFAULT 0,
  ids_ravitaillement TEXT
)`; 