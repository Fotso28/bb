import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvarisPage } from './avaris.page';

describe('AvarisPage', () => {
  let component: AvarisPage;
  let fixture: ComponentFixture<AvarisPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AvarisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
