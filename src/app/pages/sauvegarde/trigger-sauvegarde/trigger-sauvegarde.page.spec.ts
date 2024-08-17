import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TriggerSauvegardePage } from './trigger-sauvegarde.page';

describe('TriggerSauvegardePage', () => {
  let component: TriggerSauvegardePage;
  let fixture: ComponentFixture<TriggerSauvegardePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TriggerSauvegardePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
