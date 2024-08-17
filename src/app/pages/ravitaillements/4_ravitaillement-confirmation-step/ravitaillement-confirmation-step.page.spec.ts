import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RavitaillementConfirmationStepPage } from './ravitaillement-confirmation-step.page';

describe('RavitaillementConfirmationStepPage', () => {
  let component: RavitaillementConfirmationStepPage;
  let fixture: ComponentFixture<RavitaillementConfirmationStepPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RavitaillementConfirmationStepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
