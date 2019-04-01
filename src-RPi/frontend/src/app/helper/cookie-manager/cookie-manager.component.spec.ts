import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieManagerComponent } from './cookie-manager.component';

describe('CookieManagerComponent', () => {
  let component: CookieManagerComponent;
  let fixture: ComponentFixture<CookieManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
