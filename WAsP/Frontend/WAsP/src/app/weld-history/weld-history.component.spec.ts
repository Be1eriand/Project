import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeldHistoryComponent } from './weld-history.component';

describe('WeldHistoryComponent', () => {
  let component: WeldHistoryComponent;
  let fixture: ComponentFixture<WeldHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeldHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeldHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
