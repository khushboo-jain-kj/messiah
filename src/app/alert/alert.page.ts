import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, NavController, ActionSheetController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {
  weatherNews: Array<any> = [];
  cycloneAlertPer: number = -1;

  constructor(
    public weatherService: WeatherService,
    public alertController: AlertController,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public loadingController: LoadingController,
    public camera: Camera) {
    WeatherService.locationCoords.lattitude = 40.67;
    WeatherService.locationCoords.longitude = -83.65;
  }

  ngOnInit() {
    this.openCyclonePredectionByimage();
    this.openWeatherNews();
  }

  openWeatherNews() {
    this.weatherService.getNewsByCord(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude).subscribe(data => {
      this.weatherNews = data;
      this.weatherNews.forEach(news => {
        let tone: string = news.severity + ' ' + news.eventDescription;
        if (tone.toUpperCase().indexOf('FLOOD') != -1) tone = 'flood';
        if (tone.toUpperCase().indexOf('CYCLONE') != -1) tone = 'cyclone';
        this.weatherService.getSentimentByMessage(tone).subscribe(res => {
          let data = res.json();
          if (data && data.document_tone && data.document_tone.tones && data.document_tone.tones.length > 0) {
            data.document_tone.tones.forEach(tone => {
              if (tone.score > 0.6) {
                news.tone = tone.tone_name;
              }
            });
          }
        });
      })
    });
  }

  openNewsDetail(news) {
    if (news.detail) {
      news.isOpen = news.isOpen === 1 ? 0 : 1;
      return;
    }
    this.weatherService.getNewsDetails(news.detailKey).subscribe(data => {
      news.detail = data.texts[0];
      news.isOpen = 1;
    });
  }

  openCyclonePredectionByimage() {
    this.weatherService.getDisasterImageAnalysisData('').subscribe(res => {
      let data = res.json();
      if (data && data.images && data.images.length > 0 && data.images[0].classifiers && data.images[0].classifiers.length > 0 && data.images[0].classifiers[0].classes
        && data.images[0].classifiers[0].classes.length > 0) {
        if (data.images[0].classifiers[0].classes[0].class === 'Cyclone')
          this.cycloneAlertPer = data.images[0].classifiers[0].classes[0].score * 100;
      }
    });
  }
}

