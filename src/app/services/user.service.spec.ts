import { TestBed } from '@angular/core/testing';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get active user', async () => {
    const testUser: User = { id: 1, username: 'Test User', 
      abonnementActivationCode: "", token: '', abonnementPaymentDate: 0, 
      appExpirationDate: 0, 
      appVersion: 'v1', 
      isAppObsolete: false, 
      localite: '', 
      phoneId: '', 
      telephone: '' };

    // Test setting active user
    service.setActiveUser(testUser);

    // Test getting active user
    const activeUser = await service.getActiveUser();

    expect(activeUser).toEqual(testUser);
  });

  it('should return null if no active user is set', () => {
    // Clear any existing active user
    localStorage.removeItem('User');

    // Test getting active user when none is set
    const activeUser = service.getActiveUser();

    expect(activeUser).toBeNull();
  });
});
