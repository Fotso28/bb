import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RavitaillementEmballageStepPage } from './ravitaillement-emballage-step.page';

describe('RavitaillementEmballageStepPage', () => {
  let component: RavitaillementEmballageStepPage;
  let fixture: ComponentFixture<RavitaillementEmballageStepPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RavitaillementEmballageStepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
