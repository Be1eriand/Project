import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelderHistoryComponent } from './welder-history.component';

describe('WelderHistoryComponent', () => {
  let component: WelderHistoryComponent;
  let fixture: ComponentFixture<WelderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelderHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
