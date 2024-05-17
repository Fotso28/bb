import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoreDetailPage } from './more-detail.page';

describe('MoreDetailPage', () => {
  let component: MoreDetailPage;
  let fixture: ComponentFixture<MoreDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MoreDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
