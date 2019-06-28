import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotPage } from './chatbot.page';

describe('ChatbotPage', () => {
  let component: ChatbotPage;
  let fixture: ComponentFixture<ChatbotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbotPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
