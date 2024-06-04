import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouteventComponent } from './ajoutevent.component';

describe('AjouteventComponent', () => {
  let component: AjouteventComponent;
  let fixture: ComponentFixture<AjouteventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouteventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouteventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
