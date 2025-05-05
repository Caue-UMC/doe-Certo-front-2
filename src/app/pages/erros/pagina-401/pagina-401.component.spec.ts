import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagina401Component } from './pagina-401.component';

describe('Pagina401Component', () => {
  let component: Pagina401Component;
  let fixture: ComponentFixture<Pagina401Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagina401Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Pagina401Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
