import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingPersonPage } from './missing-person.page';

describe('MissingPersonPage', () => {
  let component: MissingPersonPage;
  let fixture: ComponentFixture<MissingPersonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingPersonPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingPersonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
