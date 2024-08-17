import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SauvegardePage } from './sauvegarde.page';

describe('SauvegardePage', () => {
  let component: SauvegardePage;
  let fixture: ComponentFixture<SauvegardePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SauvegardePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
