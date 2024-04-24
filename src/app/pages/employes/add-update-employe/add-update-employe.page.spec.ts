import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateEmployePage } from './add-update-employe.page';

describe('AddUpdateEmployePage', () => {
  let component: AddUpdateEmployePage;
  let fixture: ComponentFixture<AddUpdateEmployePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUpdateEmployePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
