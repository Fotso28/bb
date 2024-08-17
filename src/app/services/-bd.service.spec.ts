import { TestBed } from '@angular/core/testing';
import { BdService } from './\-bd.service';
import { UserService } from './user.service';
import { SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { of } from 'rxjs';

describe('BdService', () => {
  let service: BdService;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let sqliteConnectionMock: jasmine.SpyObj<SQLiteConnection>;
  let sqliteDbConnectionMock: jasmine.SpyObj<SQLiteDBConnection>;

  beforeEach(() => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getActiveUser']);
    sqliteConnectionMock = jasmine.createSpyObj('SQLiteConnection', ['checkConnectionsConsistency', 'isConnection', 'retrieveConnection', 'createConnection', 'closeConnection']);
    sqliteDbConnectionMock = jasmine.createSpyObj('SQLiteDBConnection', ['open', 'query', 'getTableList']);

    TestBed.configureTestingModule({
      providers: [
        BdService,
        { provide: UserService, useValue: userServiceMock },
        { provide: SQLiteConnection, useValue: sqliteConnectionMock }
      ]
    });

    service = TestBed.inject(BdService);
    service['db'] = sqliteDbConnectionMock; // Injecting the mock db connection
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isFirstRun', () => {
    it('should return true if it is the first run', () => {
      localStorage.removeItem('IS_FIRST');
      expect(service.isFirstRun()).toBeTrue();
      expect(localStorage.getItem('IS_FIRST')).toEqual('1');
    });

    it('should return false if it is not the first run', () => {
      localStorage.setItem('IS_FIRST', '1');
      expect(service.isFirstRun()).toBeFalse();
    });
  });

  describe('initDatabase', () => {
    it('should initialize the database and return true on success', async () => {
      sqliteConnectionMock.checkConnectionsConsistency.and.returnValue(Promise.resolve({ result: true }));
      sqliteConnectionMock.isConnection.and.returnValue(Promise.resolve({ result: true }));
      sqliteConnectionMock.retrieveConnection.and.returnValue(Promise.resolve(sqliteDbConnectionMock));
      sqliteDbConnectionMock.getTableList.and.returnValue(Promise.resolve({ values: [] }));
      sqliteDbConnectionMock.query.and.returnValue(Promise.resolve({ values: [] }));

      const result = await service.initDatabase();
      expect(result).toBeTrue();
    });

    it('should return false if an error occurs', async () => {
      sqliteConnectionMock.checkConnectionsConsistency.and.returnValue(Promise.reject('error'));
      const result = await service.initDatabase();
      expect(result).toBeFalse();
    });
  });

  describe('create', () => {
    it('should insert data and return the new value', async () => {
      const mockData = { id: 1, className: 'Produit', nom: 'Produit 1', user_id: 1 };
      userServiceMock.getActiveUser.and.returnValue({ id: 1, name: 'Toto', age: 12 });
      sqliteDbConnectionMock.query.and.returnValue(Promise.resolve({ values: [{ id: 1 }] }));

      const result = await service.create(mockData, true);
      if (result && result.values) {
        expect(result.values[0].id).toEqual(1);
      } else {
        fail('Expected result to have property values');
      }
    });

    it('should throw an error if user_id is not defined', async () => {
      const mockData = { id: 1, className: 'Produit', nom: 'Produit 1' };
      userServiceMock.getActiveUser.and.returnValue(null);

      try {
        await service.create(mockData, true);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('None of the users are defined');
        } else {
          fail('Expected an instance of Error to be thrown');
        }
      }
    });
  });

  describe('read', () => {
    it('should return data for a valid id', async () => {
      const mockResult = { values: [{ id: 1, nom: 'Produit 1' }] };
      sqliteDbConnectionMock.query.and.returnValue(Promise.resolve(mockResult));

      const result = await service.read('Produit', 1);
      expect(result).toEqual(mockResult.values[0]);
    });

    it('should return null if no data is found', async () => {
      const mockResult = { values: [] };
      sqliteDbConnectionMock.query.and.returnValue(Promise.resolve(mockResult));

      const result = await service.read('Produit', 1);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update data and return true', async () => {
      const mockData = { id: 1, className: 'Produit', nom: 'Produit Updated', user_id: 1 };
      userServiceMock.getActiveUser.and.returnValue({ id: 1, name: 'Toto', age: 12 });
      sqliteDbConnectionMock.query.and.returnValue(Promise.resolve({}));

      const result = await service.update(mockData);
      expect(result).toBeTrue();
    });

    it('should throw an error if user_id is not defined', async () => {
      const mockData = { id: 1, className: 'Produit', nom: 'Produit Updated' };
      userServiceMock.getActiveUser.and.returnValue(null);

      try {
        await service.update(mockData);
      } catch (error) {
        if( error instanceof Error){
          expect(error.message).toEqual('None of the users are defined');
        }else{
          fail("Une erreur inattendue s'est produite")
        }
      }
    });
  });

  describe('delete', () => {
    it('should delete data and return true', async () => {
      const mockData = { id: 1, className: 'Produit', nom: 'Produit 1' };
      sqliteDbConnectionMock.query.and.returnValue(Promise.resolve({}));

      const result = await service.delete(mockData);
      expect(result).toBeTrue();
    });

    it('should soft delete data if deletedAt field is present', async () => {
      const mockData = { id: 1, className: 'Produit', nom: 'Produit 1', deletedAt: 0, user_id: 1 };
      userServiceMock.getActiveUser.and.returnValue({ id: 1, name: 'Toto', age: 12 });
      spyOn(service, 'update').and.returnValue(Promise.resolve(true));

      const result = await service.delete(mockData);
      expect(result).toBeTrue();
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('readAll', () => {
    it('should return all data from the table', async () => {
      const mockResult = { values: [{ id: 1, nom: 'Produit 1' }, { id: 2, nom: 'Produit 2' }] };
      sqliteDbConnectionMock.query.and.returnValue(Promise.resolve(mockResult));

      const result = await service.readAll('Produit');
      expect(result).toEqual(mockResult.values.reverse());
    });
  });
});

