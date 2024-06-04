import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutgroupComponent } from './ajoutgroup.component';

describe('AjoutgroupComponent', () => {
  let component: AjoutgroupComponent;
  let fixture: ComponentFixture<AjoutgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutgroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
