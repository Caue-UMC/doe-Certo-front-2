import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaComponent } from './admin-lista.component';

describe('AdminListaComponent', () => {
  let component: AdminListaComponent;
  let fixture: ComponentFixture<AdminListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
