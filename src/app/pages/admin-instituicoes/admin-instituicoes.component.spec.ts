import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstituicoesComponent } from './admin-instituicoes.component';

describe('AdminInstituicoesComponent', () => {
  let component: AdminInstituicoesComponent;
  let fixture: ComponentFixture<AdminInstituicoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInstituicoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminInstituicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
