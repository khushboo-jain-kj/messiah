import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoNetworkPage } from './no-network.page';

describe('NoNetworkPage', () => {
  let component: NoNetworkPage;
  let fixture: ComponentFixture<NoNetworkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoNetworkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoNetworkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
