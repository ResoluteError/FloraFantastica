import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSensorRowComponent } from './add-sensor-row.component';

describe('AddSensorRowComponent', () => {
  let component: AddSensorRowComponent;
  let fixture: ComponentFixture<AddSensorRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSensorRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSensorRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
