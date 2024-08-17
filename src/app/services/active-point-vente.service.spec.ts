import { TestBed } from '@angular/core/testing';

import { ActivePointVenteService } from './active-point-vente.service';

describe('ActivePointVenteService', () => {
  let service: ActivePointVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivePointVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
