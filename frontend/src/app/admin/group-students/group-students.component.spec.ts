import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupStudentsComponent } from './group-students.component';

describe('GroupStudentsComponent', () => {
  let component: GroupStudentsComponent;
  let fixture: ComponentFixture<GroupStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupStudentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
