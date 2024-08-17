import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RistournePage } from './ristourne.page';

describe('RistournePage', () => {
  let component: RistournePage;
  let fixture: ComponentFixture<RistournePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RistournePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
