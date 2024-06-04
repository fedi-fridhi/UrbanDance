import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsubscribersComponent } from './eventsubscribers.component';

describe('EventsubscribersComponent', () => {
  let component: EventsubscribersComponent;
  let fixture: ComponentFixture<EventsubscribersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsubscribersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
