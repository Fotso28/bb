import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddUpdateFamillePage } from './add-update-famille.page';

describe('AddUpdateFamillePage', () => {
  let component: AddUpdateFamillePage;
  let fixture: ComponentFixture<AddUpdateFamillePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AddUpdateFamillePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
