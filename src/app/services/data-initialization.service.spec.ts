import { TestBed } from '@angular/core/testing';

import { DataInitializationService } from './data-initialization.service';

describe('DataInitializationService', () => {
  let service: DataInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
