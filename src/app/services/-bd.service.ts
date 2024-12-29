import { Injectable, signal } from '@angular/core';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection, 
         DBSQLiteValues, capSQLiteJson } from '@capacitor-community/sqlite';
import { User, UserService } from './user.service';
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
  private bdIsReadyAndTableCreated: boolean = false;
  public dbIsready: boolean = false;
  // private database_tables : Array<string> = [
  //   USER_TABLE ,PRODUIT_RAVITAILLES, 
  //   FAMILLE_TABLE, CASIER_SUP_TABLE, HISTORIQUE_TABLE, AVARIS_TABLE, 
  //   CASIER_TABLE, CATEGORIE_TABLE, EMPLOYE_TABLE, FOURNISSEUR_TABLE,
  //   POINT_VENTE_TABLE, PRODUIT_TABLE, DEPENSE_TABLE,
  //   RAVITAILLEMENT_TABLE, VENTE_TABLE, TABLE_RESTE, CHANGE_LOG
  // ];
  
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

      if(!this.db){
        this.db = await this.initConnection();
        await this.openConnection();
        // let table = await this.db.query("SELECT name FROM sqlite_master WHERE type='table';");
        // let column = await this.db.query(`PRAGMA database_list`);
        // console.log("table est :", table);
        // await this.DropTables();
        
        await this.loadOrCreateTable();

        const change = await this.query("select * from Change_log");

        console.log(change)
      
      }
      
      // this.closeConnection();
      this.dbIsready = true;
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

  async query(sql: string, paranoidSelectQuery: boolean = false, value: Array<any> = []): Promise<DBSQLiteValues>{
    try {
      return await this.db.query(sql, value);
    } catch (error) {
      throw new Error(`La base de donnée n'a pas été correctement initialisée`);
    }
  }

  async isFirst(): Promise<boolean>{
    // if(await this.checkDatabaseExists(DB_NAME)){
    //   return false;
    // }
    let result = await this.query("Select * from Produit");
    console.log("le resultat est :", !result.values?.length)
    return !!result.values?.length;
  }

  async loadOrCreateTable(): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!this.db) {
                console.log("db n'est pas initialisé");
                return reject(new Error("La base de données n'est pas initialisée."));
            }

            // Boucle asynchrone pour exécuter les requêtes séquentiellement
            for (const table of DATABASE_TABLE) {
                try {
                    const result = await this.db.query(table);
                } catch (err) {
                    console.error(`Erreur lors de la création de la table : ${table}`, err);
                    return reject(err); // Rejeter la promesse si une table échoue
                }
            }

            // Une fois toutes les tables traitées, la base est prête
            this.bdIsReadyAndTableCreated = true;
            resolve(); // Résolution de la promesse une fois terminé
        } catch (error) {
            console.error("Erreur générale dans loadOrCreateTable :", error);
            reject(error); // Rejeter la promesse en cas d'erreur générale
        }
    });
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
      // creer du temps supplementaire pour la création de la base de donnée
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

      data.user_id = ( await this.getActiveUser())?.id;
      
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
      console.log("le _newval etait : ", _newval);
      console.log('tablename est :', table_name);

      const last_insert_rowid: any = (await this.db.query(`SELECT Max(last_insert_rowid()) as id FROM ${table_name}`)).values;
      
      
      
      let log: Log = {
        action: "INSERT",
        record_id: last_insert_rowid[0]?.id,
        table_name: data.className,
        timestamp: + Date.now()
      }
      await this.addLog(log);

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

      data.user_id = (await this.getActiveUser())?.id;
      if(!data.user_id) throw new Error("None of the users are defined");
      if(Object.keys(data).includes('deletedAt')){
        if(!data.deletedAt){
          data.deletedAt = 0;
        }
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
      
      let log: Log = new Log();
      log.action = "UPDATE";
      log.record_id = data?.id;
      log.table_name = data.className;
      log.timestamp = + Date.now();

      await this.addLog(log);
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

      
      let log: Log = {
        action: "DELETE",
        record_id: data.id,
        table_name: data.className,
        timestamp: + Date.now()
      }
      await this.addLog(log);

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

  async loadData() {
    try {
      if ((await this.isFirst())) {
        console.warn("La base de donnée existe déjà");
        return;
      }

      if(!this.dbIsready){
        throw Error("La base de donnée n'est initialisée !!")
      }
  
      // Récupérer l'utilisateur actif
      const active_user_id = (await this.getActiveUser())?.id;
      if (!active_user_id) throw new Error("None of the users are defined");
  
      // Remplacer l'ID de l'utilisateur actif dans les données
      replaceUserId(active_user_id);
  
      for (const tableData of DEFAULT_DATA) {
        // Construire la requête d'insertion
        const insertQuery = `INSERT INTO ${tableData.table} (${Object.keys(tableData.values[0]).join(
          ', '
        )}) VALUES (${Object.keys(tableData.values[0])
          .map(() => '?')
          .join(', ')})`;
  
        // Nettoyer les données existantes (facultatif)
        console.log(`DELETE FROM ${tableData.table}`);
        await this.db.query(`DELETE FROM ${tableData.table}`);
  
        // // Boucle séquentielle pour chaque élément
        // let previousInsertId: number | null = null;
  
        for (const item of tableData.values) {
          // Exécuter l'insertion
          await this.db.query(insertQuery, Object.values(item));
  
          // Récupérer l'ID de la dernière ligne insérée
          const lastInsertResult: any = (await this.db.query(`SELECT MAX(id) as id FROM ${tableData.table}`))?.values;
          
          console.warn(lastInsertResult);
          if (!lastInsertResult.length) {
            throw new Error(`Failed to retrieve the last inserted ID for table: ${tableData.table}`);
          }

          const lastInsertId = lastInsertResult[0].id;
  
          console.log(`ID inséré dans ${tableData.table}: ${lastInsertId}`);
  
          // Stocker l'ID si nécessaire pour les enregistrements suivants
          // previousInsertId = lastInsertId;
  
          // Créer et enregistrer un log
          const log: Log = {
            action: "INSERT",
            record_id: lastInsertId,
            table_name: tableData.table,
            timestamp: Date.now(),
          };
          await this.addLog(log);
  
          // Ajouter une logique ici si vous souhaitez utiliser `previousInsertId` pour un autre enregistrement
        }
      }
  
      console.log('All items inserted successfully');
    } catch (error) {
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

    /***
   * Set a User as active
   * @param User
   */
    // async setActiveUser(user: User):Promise<void>{
    //   await this.query('INSERT INTO User (username, telephone, localite, phoneId, appVersion, appExpirationDate, isAppObsolete, abonnementActivationCode, abonnementPaymentDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    //     , false,
    //     [user.username, user.telephone, user.localite, user.phoneId, user.appVersion, user.appExpirationDate, user.isAppObsolete, user.abonnementActivationCode, user.abonnementPaymentDate]
    //   )
    // }

    setActiveUser(user: User): Promise<void> {
      return new Promise(async (resolve, reject) => {

        let deleteActiveUser = await this.deleteActiveUser();
        if(!deleteActiveUser){
          reject("Failed to delete Active User");
        }

        this.query(
          `INSERT INTO User (
              id, token,
              username, telephone, localite, 
              phoneId, appVersion, appExpirationDate, 
              isAppObsolete, abonnementActivationCode, abonnementPaymentDate)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          false,
          [user.id, user.token, user.username, user.telephone, user.localite, 'user.phoneId', user.appVersion, user.appExpirationDate, user.isAppObsolete, user.abonnementActivationCode, user.abonnementPaymentDate]
        )
        .then(() => {
          resolve(); // Résolution de la promesse si tout se passe bien
        })
        .catch((error) => {
          reject(`Failed to set active user: ${error.message}`); // Rejet explicite en cas d'erreur
        });
      });
    }
    /**
     * Get active User
     * @return User | null
     */
    async getActiveUser(): Promise<User | null> {
      try {
          // Utiliser directement async/await pour éviter les promesses redondantes
          const users = await this.query('SELECT * FROM User');
          
          if (users?.values?.length) {
              console.log(users.values[0]); // Log du premier utilisateur actif
              return users.values[0]; // Retourner l'utilisateur actif
          } else {
              console.log("Aucun utilisateur actif trouvé.");
              return null; // Pas d'utilisateur trouvé
          }
      } catch (error) {
          console.error("Une erreur est survenue :", error); // Log d'erreur plus explicite
          return null; // Retourner null en cas d'erreur
      }
  }
  

    async deleteActiveUser(): Promise<boolean>{
      try {
        let isDelete = await this.query("DELETE FROM User");
        return true;
      } catch (error) {
        console.log("An error when deleting ActiveUser: ", error)
        return false
      }
    }

    /**
   * Ajoute un log dans la table `Change_log`.
   * 
   * @param {Log} log - Objet contenant les informations du log.
   * @returns {Promise<any>} - Résultat de l'opération.
   * @throws {Error} - En cas de problème avec les données ou la requête SQL.
   */
  async addLog(log: Log): Promise<any> {
    // Vérification que l'objet log n'est pas vide
    if (!log || typeof log !== 'object' || Object.keys(log).length === 0) {
        throw new Error("L'objet 'log' est invalide ou vide.");
    }
    console.log("le Log est :", log);
    // Nom de la table (configurable)
    const table_name = "Change_log";

    // Générer dynamiquement les colonnes et les valeurs
    const table_fields = Object.keys(log);
    const table_values = Object.values(log);

    // Construire la requête SQL
    const placeholders = table_fields.map(() => '?').join(', ');
    const create_sql = `INSERT INTO ${table_name} (${table_fields.join(', ')}) VALUES (${placeholders})`;

    try {
        // Exécuter la requête SQL
        const result = await this.db.query(create_sql, table_values);
        return result;
    } catch (error:any) {
        // Gestion des erreurs
        console.error("Erreur lors de l'ajout du log :", error);
        throw new Error(`Impossible d'ajouter le log : ${error.message}`);
    }
  }

  /**
   * Supprime un log dans la table `Change_log` en fonction de critères donnés.
   * 
   * @param {number} logId - ID du log à supprimer.
   * @returns {Promise<{ success: boolean; message?: string }>} - Résultat de l'opération.
   * @throws {Error} - En cas de problème avec la requête SQL.
   */
  async deleteLog(Ids: number[]): Promise<{ success: boolean; message?: string }> {
    // Vérification des entrées
    if (!Ids || !Array.isArray(Ids) || Ids.length === 0) {
        throw new Error("Une liste valide d'IDs est requise pour supprimer des logs.");
    }

    // Nom de la table (configurable)
    const tableName = "Change_log";

    // Générer des placeholders pour les IDs
    const placeholders = Ids.map(() => '?').join(', ');
    // Construire la requête SQL
    const deleteQuery = `DELETE FROM ${tableName} WHERE record_id IN (${placeholders})`;

    try {
        // Exécuter la requête SQL
        const result = await this.db.query(deleteQuery, Ids);
         return { success: true, message: `log(s) supprimé(s) avec succès.` };
        
    } catch (error: any) {
        // Gestion des erreurs
        console.error("Erreur lors de la suppression du log :", error);
        throw new Error(`Impossible de supprimer le(s) log(s) : ${error.message}`);
    }
}

}

export function replaceUserId(newUserId: number) {
  // Parcourt chaque objet dans le tableau DEFAULT_DATA
  DEFAULT_DATA.forEach(data => {
    // Vérifie si l'objet a une propriété 'values' qui est un tableau
    if (Array.isArray(data.values)) {
      // Parcourt chaque élément du tableau 'values'
      data.values.forEach((item: any) => {
        // Si l'élément a la propriété 'user_id', remplace sa valeur par newUserId
        if (item.hasOwnProperty('user_id')) {
          item.user_id = newUserId;
        }
      });
    }
  });
}



// let toto = await this.db.query("INSERT INTO Famille (nom, description) VALUES (?, ?)  ", ['toto',"je suis la description"], false)
//       let toto2 = await this.db.query("INSERT INTO User (nom, prenom) VALUES (?, ?)", ['Oswald',"Marie"], false);

const HISTORIQUE_TABLE = `CREATE TABLE IF NOT EXISTS Historique (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_id INTEGER,
  action_query TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  id_point_vente INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  id_point_vente INTEGER NOT NULL,
  all_ready_inventoried INTEGER DEFAULT 0,
  deletedAt TIMESTAMP DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produit_id) REFERENCES Produit(id)
)`;

const FAMILLE_TABLE = `CREATE TABLE IF NOT EXISTS Famille (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT,
  user_id INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP DEFAULT 0
)`;
["Avaris", "Famille",]
const USER_TABLE  = `CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL,
        telephone VARCHAR(20) NOT NULL UNIQUE,
        localite VARCHAR(255),
        token VARCHAR(255),
        phoneId VARCHAR(255) NOT NULL, -- Identifiant unique du téléphone
        appVersion VARCHAR(50), -- Version de l'application
        appExpirationDate INTEGER , -- Date d'expiration de l'application (timestamp en millisecondes)
        isAppObsolete BOOLEAN DEFAULT 0, -- Indicateur si l'application est obsolète
        abonnementPaymentDate INTEGER, -- Date du dernier paiement de l'abonnement (timestamp en millisecondes)
        abonnementActivationCode VARCHAR(255), -- Code d'activation de l'abonnement
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_admin BOOLEAN DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
    )`;

    
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
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP DEFAULT 0
)`;

const POINT_VENTE_TABLE = `CREATE TABLE IF NOT EXISTS PointVente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT,
  adresse TEXT,
  user_id INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP DEFAULT 0
)`;
["Avaris", "Famille","Produit", "PointVente", "Fournisseur", "Employe", "Categorie","Casier","",""]
const EMPLOYE_TABLE = `CREATE TABLE IF NOT EXISTS Employe (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  adresse TEXT,
  phone1 TEXT NOT NULL,
  cni TEXT,
  photo TEXT,
  user_id INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP DEFAULT 0
)`;
const CATEGORIE_TABLE = `CREATE TABLE IF NOT EXISTS Categorie (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP DEFAULT 0
)`;

const CASIER_TABLE = `CREATE TABLE IF NOT EXISTS Casier ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  nbre_btle_par_casier INTEGER NOT NULL, 
  nom TEXT NOT NULL, 
  description TEXT, 
  user_id INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP DEFAULT 0
  )`;

const DEPENSE_TABLE = `CREATE TABLE IF NOT EXISTS Depense ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    date TIMESTAMP NOT NULL, 
    type TEXT, 
    motif TEXT,
    montant INTEGER NOT NULL, 
    user_id INTEGER NOT NULL,
    id_point_vente INTEGER NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ids_ravitaillement TEXT
)`; 

const CASIER_SUP_TABLE = `CREATE TABLE IF NOT EXISTS CasierSup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK (type IN ('E', 'S')),
  nbre_bouteille INTEGER,
  id_casier INTEGER,
  user_id INTEGER,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_casier) REFERENCES Casier(id)
)`;

const PRODUIT_RAVITAILLES = `CREATE TABLE IF NOT EXISTS Produits_ravitailles (
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
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_point_vente INTEGER
)`;

const TABLE_RESTE = `CREATE TABLE IF NOT EXISTS Reste (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  user_id INTEGER NOT NULL,
  id_point_vente INTEGER NOT NULL,
  produits TEXT,
  type TEXT CHECK(type IN ('sto_update', 'sto')),
  deletedAt TIMESTAMP DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ids_ravitaillement TEXT
)`; 


const CHANGE_LOG = `CREATE TABLE IF NOT EXISTS Change_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT,
  action TEXT CHECK(action IN ('INSERT', 'UPDATE', 'DELETE')), -- INSERT, UPDATE, DELETE
  record_id INTEGER,
  timestamp TIMESTAMP
)`;

const DATABASE_TABLE  = [ USER_TABLE ,PRODUIT_RAVITAILLES, 
  FAMILLE_TABLE, CASIER_SUP_TABLE, HISTORIQUE_TABLE, AVARIS_TABLE, 
  CASIER_TABLE, CATEGORIE_TABLE, EMPLOYE_TABLE, FOURNISSEUR_TABLE,
  POINT_VENTE_TABLE, PRODUIT_TABLE, DEPENSE_TABLE,
  RAVITAILLEMENT_TABLE, VENTE_TABLE, TABLE_RESTE, CHANGE_LOG
];

export const DATABASE_TABLENAME = ["Avaris", "Famille","Produit", "Vente","CasierSup", "Produits_ravitailles","Reste", 
  "PointVente", "Fournisseur", "Employe", "Categorie","Casier","Depense","Ravitaillement"]
class Log {
  constructor(
    public id?: number, 
    public table_name?: string,
    public action? : 'INSERT' | 'UPDATE' | 'DELETE', 
    public record_id? : number,
    public timestamp? : number
  ){}
}