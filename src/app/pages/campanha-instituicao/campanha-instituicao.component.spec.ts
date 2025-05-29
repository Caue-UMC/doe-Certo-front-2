import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanhaInstituicaoComponent } from './campanha-instituicao.component';

describe('CampanhaInstituicaoComponent', () => {
  let component: CampanhaInstituicaoComponent;
  let fixture: ComponentFixture<CampanhaInstituicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampanhaInstituicaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CampanhaInstituicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
