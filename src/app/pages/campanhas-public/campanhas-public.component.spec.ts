import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanhasPublicComponent } from './campanhas-public.component';

describe('CampanhasPublicComponent', () => {
  let component: CampanhasPublicComponent;
  let fixture: ComponentFixture<CampanhasPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampanhasPublicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CampanhasPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
