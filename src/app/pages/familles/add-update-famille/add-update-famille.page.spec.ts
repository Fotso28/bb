import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateFamillePage } from './add-update-famille.page';

describe('AddUpdateFamillePage', () => {
  let component: AddUpdateFamillePage;
  let fixture: ComponentFixture<AddUpdateFamillePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUpdateFamillePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
