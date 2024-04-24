import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RavitaillementFournisseurStepPage } from './ravitaillement-fournisseur-step.page';

describe('RavitaillementFournisseurStepPage', () => {
  let component: RavitaillementFournisseurStepPage;
  let fixture: ComponentFixture<RavitaillementFournisseurStepPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(RavitaillementFournisseurStepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
