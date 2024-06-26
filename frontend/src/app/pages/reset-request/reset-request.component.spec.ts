import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetRequestComponent } from './reset-request.component';

describe('ResetRequestComponent', () => {
  let component: ResetRequestComponent;
  let fixture: ComponentFixture<ResetRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
