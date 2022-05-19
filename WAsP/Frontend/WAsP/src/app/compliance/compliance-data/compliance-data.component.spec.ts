import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceDataComponent } from './compliance-data.component';

describe('ComplianceDataComponent', () => {
  let component: ComplianceDataComponent;
  let fixture: ComponentFixture<ComplianceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
