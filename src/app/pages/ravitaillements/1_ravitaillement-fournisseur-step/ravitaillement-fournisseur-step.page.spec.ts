import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RavitaillementFournisseurStepPage } from './ravitaillement-fournisseur-step.page';

describe('RavitaillementFournisseurStepPage', () => {
  let component: RavitaillementFournisseurStepPage;
  let fixture: ComponentFixture<RavitaillementFournisseurStepPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RavitaillementFournisseurStepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
