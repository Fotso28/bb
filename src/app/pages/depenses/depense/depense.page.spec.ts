import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepensePage } from './depense.page';

describe('DepensePage', () => {
  let component: DepensePage;
  let fixture: ComponentFixture<DepensePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DepensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
