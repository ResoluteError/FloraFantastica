import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorRowComponent } from './sensor-row.component';

describe('SensorRowComponent', () => {
  let component: SensorRowComponent;
  let fixture: ComponentFixture<SensorRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
