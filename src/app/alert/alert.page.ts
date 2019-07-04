import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {
  weatherNews: Array<any> = [];
  cycloneAlertPer: number = -1;
  floodPredictionPercentage: number = -1;
  weatherData: any;
  isWeatherDetailsExpanded: boolean;
  loaderImage: string;

  constructor(
    public weatherService: WeatherService,
    public alertController: AlertController,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public loadingController: LoadingController,
    public camera: Camera,
    public router: Router) {
    WeatherService.locationCoords.lattitude = 40.67;
    WeatherService.locationCoords.longitude = -83.65;
    this.loaderImage = '../../assets/images/loader.gif';
  }

  ngOnInit() {
    this.openCyclonePredectionByimage();
    this.openWeatherNews();
    this.getWeatherDetails();
    this.getCyclonePredictionData();
  }

  toggleWeatherDetails() {
    this.isWeatherDetailsExpanded = !this.isWeatherDetailsExpanded;
  }

  getWeatherDetails() {
    this.weatherService.getWeatherByCord(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude).subscribe(res => {
      this.weatherData = res.json();
    }, err => { });
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

  getCyclonePredictionData() {
    this.weatherService.getRainfallData(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude).subscribe(ajaxResponse => {
      var AVG_RAINFALL_LAST_10_DAY = this.getAverageData((ajaxResponse.json() as any).precip24Hour, 10);
      var MARCH_TO_MAY_RAINFALL_AVG = this.getAverageData((ajaxResponse.json() as any).precip24Hour, (ajaxResponse.json() as any).precip24Hour.length - 1);
      let AVERAGE_INCREASE_RAINFALL_MAY_TO_JUNE = this.getAverageIncreaseInRainfall((ajaxResponse.json() as any).precip24Hour);
      this.weatherService.getFloodPercentage(AVG_RAINFALL_LAST_10_DAY, MARCH_TO_MAY_RAINFALL_AVG, AVERAGE_INCREASE_RAINFALL_MAY_TO_JUNE).subscribe(data => {
        this.floodPredictionPercentage = parseFloat((data.json() as any).values[0][4]) < 0 ? 0 : parseFloat((data.json() as any).values[0][4]) * 100;
      });
    });
  }

  getAverageData(precipitationData, days) {
    var averageData = 0;
    for (var i = 0; i <= parseInt(days); i++) {
      averageData = parseFloat(averageData.toString()) +
        parseFloat(precipitationData[precipitationData.length - i - 1].toString());
    }
    return (averageData / parseInt(days));
  }

  getAverageIncreaseInRainfall(precipitationData) {
    var averageData = 0;
    let differenceSet: Array<number> = [];
    for (var i = 0; i < precipitationData.length; i++) {
      if (i < precipitationData.length - 1) {
        differenceSet.push(precipitationData[i] - precipitationData[i + 1]);
      }
    }
    for (var i = 0; i < differenceSet.length; i++) {
      averageData = parseFloat(averageData.toString()) +
        parseFloat(differenceSet[differenceSet.length - i - 1].toString());
    }
    return (averageData / parseInt(differenceSet.length.toString()));
  }

  goToPage(no: any) {
    if (no === 1)//safe home
    {
      this.router.navigate(['/list']);
    }

    if (no === 2) //chatbot
    {
      this.router.navigate(['/chatbot']);
    }
  }

}

