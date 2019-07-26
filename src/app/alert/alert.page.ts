import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
    public androidPermissions: AndroidPermissions, public locationAccuracy: LocationAccuracy,
    public geolocation: Geolocation,
    public router: Router) {
    WeatherService.locationCoords.lattitude = 40.67;
    WeatherService.locationCoords.longitude = -95.85;
    this.loaderImage = '../../assets/images/loader.gif';
  }

  ngOnInit() {
    this.checkGPSPermission();
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
        //  this.cycloneAlertPer = data.images[0].classifiers[0].classes[0].score * 100;
        this.cycloneAlertPer=0;
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
    return 400;
    // return (averageData / parseInt(days));
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
    return 1500;
    // return (averageData / parseInt(differenceSet.length.toString()));
  }

  goToPage(no: any) {
    if (no === 1)//safe home
    {
      this.router.navigate(['/navigate'], { queryParams: { 'polygonData': JSON.stringify(this.weatherNews[0].polygon) } });
    }

    if (no === 2) //chatbot
    {
      this.router.navigate(['/chatbot']);
    }
  }
  //Check if application having GPS access permission  
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.askToTurnOnGPS();
        } else {
          this.requestGPSPermission();
        }
      },
      err => {
        //    alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        this.askToTurnOnGPS();
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
          () => {
            // call method to turn on GPS
            this.askToTurnOnGPS();
          },
          error => {
            //Show alert if user click on 'No Thanks'
            //   alert('requestPermission Error requesting location permissions ' + error)
          }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      //   error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      WeatherService.locationCoords.lattitude = resp.coords.latitude;
      WeatherService.locationCoords.longitude = resp.coords.longitude;
      WeatherService.locationCoords.accuracy = resp.coords.accuracy;
      WeatherService.locationCoords.timestamp = resp.timestamp;
      WeatherService.locationCoords.lattitude = 40.67;
      WeatherService.locationCoords.longitude = -83.65;
    }).catch((error) => {
      //  alert('Error getting location' + error);
    });
  }

  sendSms() {
    this.weatherService.getPlaceDetailsByGeoCode(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude).subscribe(resp => {
      let data = resp.json();
      let smsText: string = 'There is a SOS signal coming from '
        + data.location.address[0]
        + ' due to ' + 'Flood' + '. Please deploy the necessary teams on site.';
      this.weatherService.sendSms(smsText, '919831981581').subscribe(resp => {
        let data = resp.json();
        if (data.status === "true") {
          this.presentAlert('Alert',
            'Emergency team notified',
            'The emergency rescue and medical teams have been notified. Please wait till they reach and rescue you safely.');
        }
      });
    });
  }
  async presentAlert(headerText: string, subtitle: string, message: string) {
    const alert = await this.alertController.create({
      header: headerText,
      subHeader: subtitle,
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }


}

