import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampanhasComponent } from './admin-campanhas.component';

describe('AdminCampanhasComponent', () => {
  let component: AdminCampanhasComponent;
  let fixture: ComponentFixture<AdminCampanhasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCampanhasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminCampanhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
