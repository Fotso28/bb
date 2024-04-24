import { TestBed } from '@angular/core/testing';

import { AvarisService } from './avaris.service';

describe('AvarisService', () => {
  let service: AvarisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvarisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
