import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicoesPublicComponent } from './instituicoes-public.component';

describe('InstituicoesPublicComponent', () => {
  let component: InstituicoesPublicComponent;
  let fixture: ComponentFixture<InstituicoesPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituicoesPublicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituicoesPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
