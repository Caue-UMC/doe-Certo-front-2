import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagina500Component } from './pagina-500.component';

describe('Pagina500Component', () => {
  let component: Pagina500Component;
  let fixture: ComponentFixture<Pagina500Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagina500Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Pagina500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
