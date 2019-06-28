import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { ChatMessage } from '../models/chat-message';
import { DomSanitizer } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})

export class ChatbotPage implements OnInit {

  constructor(private weatherService: WeatherService, private renderer: Renderer2, private sanitizer: DomSanitizer,
    private cdref: ChangeDetectorRef) { }
  chatMessages: Array<ChatMessage> = [];
  userText: string = "";
  watsonResponse: any = [];
  isSessionCreated: boolean;
  uuid: any;

  @ViewChild('chatMessage') chatMessage: ElementRef;

  ngOnInit() {
    this.clearLastChatData();
    this.isSessionCreated = this.createSession();
  }


  clearLastChatData() {
    this.chatMessages = [];
    this.isSessionCreated = false;
    this.userText = '';
    this.watsonResponse = '';
  }

  createSession(): boolean {
    let isSessionCreated: boolean = false;
    if (!WeatherService.chatSessionId) {
      this.weatherService.createChatSession().subscribe(res => {
        let data = res.json();
        WeatherService.chatSessionId = data.session_id;
        if (WeatherService.chatSessionId) {
          isSessionCreated = true;
        }
      });
    }
    return isSessionCreated;
  }

  checkIfSessionExistsInWatson(data: any): boolean {
    let isSessionExistsInWatson: boolean = true;
    if (data.code === 404) {
      isSessionExistsInWatson = false;
    }
    return isSessionExistsInWatson;
  }

  loadData($event) {

  }

  pushChatMessage(message: string, sentFrom: string) {
    let chatMessage: ChatMessage = new ChatMessage();
    chatMessage.chatFrom = sentFrom;
    chatMessage.chatTime = new Date().toString();
    chatMessage.chatMessage = this.sanitizer.bypassSecurityTrustHtml(message);
    this.chatMessages.push(chatMessage);
  }

  sendMessageToWatson(inputKeyWordToCallWatson: string, inputStringToShowToUser?: string) {
    this.weatherService.sendBotMessage(WeatherService.chatSessionId, inputKeyWordToCallWatson).subscribe(response => {
      let data = response.json();
      if (this.checkIfSessionExistsInWatson(data)) {
        this.watsonResponse = this.decodeWatsonMessage(data.output.generic[0]);
        this.watsonResponse = this.watsonResponse.replace(/(?:\r\n|\r|\n)/g, '<br>');
        this.pushChatMessage(inputStringToShowToUser === undefined || inputStringToShowToUser === '' ? this.watsonResponse : inputStringToShowToUser, 'WATSON');
      } else {
        this.isSessionCreated = this.createSession();
        if (this.isSessionCreated) {
          WeatherService.chatSessionId = undefined;
          this.sendMessageToWatson(inputKeyWordToCallWatson, inputStringToShowToUser);
        }
      }
      this.cdref.detectChanges();
      document.getElementById(this.uuid).addEventListener("click", event => {
        if ((event as any).target.nodeName !== 'LI') {
          return;
        }
       //  document.getElementById(this.uuid).removeEventListener('click',event=>{});
        this.sendMessageToWatson((event as any).target.attributes[0].value);
        this.pushChatMessage((event as any).target.textContent, 'USER');
      });
    });


  }

  sendUserInputToWatson() {
    let text: string = this.userText;
    this.userText = "";
    this.sendMessageToWatson(text);
    this.pushChatMessage(text, 'USER');
  }

  decodeWatsonMessage(data: any): string {
    let outputText: string;
    switch (data.response_type) {
      case 'text':
        outputText = data.text;
        break;
      case 'option':
        this.uuid = UUID.UUID();
        outputText = "<ul id=" + this.uuid + " style=\"list-style-type: none;padding-inline-start: 2%;\">";
        data.options.forEach(option => {
          outputText = outputText +
            "<li value='" +
            option.value.input.text
            + " >"
            + option.label
            + "</li>";
        });
        outputText = outputText + "</ul>";

        break;
      default:
        break;
    }
    return outputText;
  }

  createOptionElement(data: any) {
    data.options.forEach(option => {
      let optionElement;
      optionElement = this.renderer.createElement('span');
      this.renderer.addClass(optionElement, 'change_this');
      this.renderer.appendChild(this.chatMessage, optionElement);
    });
  }
}

