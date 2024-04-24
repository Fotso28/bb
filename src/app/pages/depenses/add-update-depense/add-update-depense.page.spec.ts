import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateDepensePage } from './add-update-depense.page';

describe('AddUpdateDepensePage', () => {
  let component: AddUpdateDepensePage;
  let fixture: ComponentFixture<AddUpdateDepensePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUpdateDepensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
