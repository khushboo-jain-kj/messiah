import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityForumPage } from './community-forum.page';

describe('CommunityForumPage', () => {
  let component: MissingPersonPage;
  let fixture: ComponentFixture<CommunityForumPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityForumPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityForumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
