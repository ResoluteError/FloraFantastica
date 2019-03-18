import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantCardComponent } from './add-plant-card.component';

describe('AddPlantCardComponent', () => {
  let component: AddPlantCardComponent;
  let fixture: ComponentFixture<AddPlantCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlantCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
