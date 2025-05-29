import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditarComponent } from './admin-editar.component';

describe('AdminEditarComponent', () => {
  let component: AdminEditarComponent;
  let fixture: ComponentFixture<AdminEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
