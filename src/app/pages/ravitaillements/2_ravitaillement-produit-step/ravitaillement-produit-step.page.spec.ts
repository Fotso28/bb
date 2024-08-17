import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RavitaillementProduitStepPage } from './ravitaillement-produit-step.page';

describe('RavitaillementProduitStepPage', () => {
  let component: RavitaillementProduitStepPage;
  let fixture: ComponentFixture<RavitaillementProduitStepPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RavitaillementProduitStepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
