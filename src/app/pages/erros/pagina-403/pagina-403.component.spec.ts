import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagina403Component } from './pagina-403.component';

describe('Pagina403Component', () => {
  let component: Pagina403Component;
  let fixture: ComponentFixture<Pagina403Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagina403Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Pagina403Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
