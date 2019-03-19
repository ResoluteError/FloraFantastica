import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInputComponent } from './health-input.component';

describe('HealthInputComponent', () => {
  let component: HealthInputComponent;
  let fixture: ComponentFixture<HealthInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
