import { TestBed } from '@angular/core/testing';

import { HistoriqueImageUploadedService } from './historique-image-uploaded.service';

describe('HistoriqueImageUploadedService', () => {
  let service: HistoriqueImageUploadedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueImageUploadedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
