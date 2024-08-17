import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DepensePage } from './depense.page';

describe('DepensePage', () => {
  let component: DepensePage;
  let fixture: ComponentFixture<DepensePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DepensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
