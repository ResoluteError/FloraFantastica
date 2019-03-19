import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorManagerComponent } from './sensor-manager.component';

describe('SensorManagerComponent', () => {
  let component: SensorManagerComponent;
  let fixture: ComponentFixture<SensorManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
