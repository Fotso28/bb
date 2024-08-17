import { TestBed } from '@angular/core/testing';

import { SyncDatabaseService } from './backup.service';

describe('BackupService', () => {
  let service: SyncDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
