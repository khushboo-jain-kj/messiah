import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import * as moment from 'moment';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {

  locationCoords: any;
  powerDisruptionData: any;

  weatherNews: Array<any> = [];

  constructor(public androidPermissions: AndroidPermissions,
    public locationAccuracy: LocationAccuracy,
    public geolocation: Geolocation,
    public weatherService: WeatherService) {
    this.locationCoords = {};
  }

  ngOnInit() {
    //this.checkGPSPermission();
    this.getWeatherNews();
  }

  getHomeScreenData() {
    this.getWeatherNews(this.locationCoords.latitude, this.locationCoords.longitude);
  }

  getPowerDisruptionForNext30Days(lattitude?: any, longitude?: any) {
    this.weatherService.getPowerDisruptionForecast(lattitude, longitude).subscribe(resp => {
      let data: any = resp.json();
      this.powerDisruptionData = data;
    });
  }

  getWeatherNews(lattitude?: any, longitude?: any) {
    lattitude = 40.95;
    longitude = -87.4;

    // Retrieve the weather news at first. This brings out the weather headlines to display to the user.
    this.weatherService.getNewsByCord(lattitude.toString(), longitude.toString()).subscribe(newsData => {
      let data = newsData.json();
      this.weatherNews = data ? data.alerts : [];
      // this.weatherNews = [];
      if (this.weatherNews.length === 0) {
        this.getWeatherHeadLinesHardCodeData();
      }
      (this.weatherNews as Array<any>).forEach(element => {
        this.getNewsDetails(element);
      });
      (this.weatherNews as Array<any>).forEach(element => {
        this.getNewsSentiment(element);
      });
      console.log(this.weatherNews);
    });
  }

  getNewsDetails(news: any) {
    // this.newsItem = null;
    this.weatherService.getNewsDetails(news.detailKey).subscribe(newsObject => {
      let data = newsObject.json();
      let index: number = this.findWithAttr(this.weatherNews, 'detailKey', news.detailKey);
      this.weatherNews[index].detail = data.alertDetail;
    });
  }

  findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
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
        alert(err);
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
              alert('requestPermission Error requesting location permissions ' + error)
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
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

  getNewsSentiment(news: any) {
    let response: any;
    this.weatherService.getSentimentByMessage(news.severity + ' ' + news.headlineText).subscribe(res => {
      response = res.json();
      this.getCardIntentClassName(response, news);
    });
  }

  getCardIntentClassName(response: any, news: any) {
    let toneArray: Array<any> = [];
    let className: string = 'tertiary';

    if ((response as any) && (response as any).document_tone) {
      ((response as any).document_tone.tones as Array<any>).forEach(element => {
        if (element.score > 0.6) {
          toneArray.push(element.tone_name);
        }
      });
    }

    if (toneArray.length > 0) {
      toneArray.forEach(element => {
        if (element === 'Anger' || element === 'Fear') {
          className = 'danger';
        } else {
          className = 'warning';
        }
      });
    }
    let index: number = this.findWithAttr(this.weatherNews, 'detailKey', news.detailKey);
    this.weatherNews[index].class = className;
  }

  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      this.getHomeScreenData();
    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }

  getWeatherHeadLinesHardCodeData() {
    this.weatherNews.push(JSON.parse("{\"detailKey\":\"eab809ea-01a2-3901-88a3-f1883c4bc6d2\",\"messageTypeCode\":2,\"messageType\":\"Update\",\"productIdentifier\":\"FLS\",\"phenomena\":\"FL\",\"significance\":\"W\",\"eventTrackingNumber\":\"0130\",\"officeCode\":\"KLOT\",\"officeName\":\"Chicago\",\"officeAdminDistrict\":\"Illinois\",\"officeAdminDistrictCode\":\"IL\",\"officeCountryCode\":\"US\",\"eventDescription\":\"River Flood Warning\",\"severityCode\":2,\"severity\":\"Severe\",\"categories\":[{\"category\":\"Met\",\"categoryCode\":2}],\"responseTypes\":[{\"responseType\":\"Avoid\",\"responseTypeCode\":5},{\"responseType\":\"Evacuate\",\"responseTypeCode\":2}],\"urgency\":\"Unknown\",\"urgencyCode\":5,\"certainty\":\"Unknown\",\"certaintyCode\":5,\"effectiveTimeLocal\":null,\"effectiveTimeLocalTimeZone\":null,\"expireTimeLocal\":\"2019-06-28T01:00:00-05:00\",\"expireTimeLocalTimeZone\":\"CDT\",\"expireTimeUTC\":1561701600,\"onsetTimeLocal\":null,\"onsetTimeLocalTimeZone\":null,\"flood\":{\"floodLocationId\":\"SLBI3\",\"floodLocationName\":\"Kankakee River at Shelby\",\"floodSeverityCode\":\"1\",\"floodSeverity\":\"Minor\",\"floodImmediateCauseCode\":\"ER\",\"floodImmediateCause\":\"Excessive Rainfall\",\"floodRecordStatusCode\":\"NO\",\"floodRecordStatus\":\"A record flood is not expected\",\"floodStartTimeLocal\":\"2019-06-21T03:15:00-05:00\",\"floodStartTimeLocalTimeZone\":\"CDT\",\"floodCrestTimeLocal\":\"2019-06-24T21:15:00-05:00\",\"floodCrestTimeLocalTimeZone\":\"CDT\",\"floodEndTimeLocal\":\"2019-06-27T19:00:00-05:00\",\"floodEndTimeLocalTimeZone\":\"CDT\"},\"areaTypeCode\":\"C\",\"latitude\":40.95,\"longitude\":-87.4,\"areaId\":\"INC111\",\"areaName\":\"Newton County\",\"ianaTimeZone\":\"America/Chicago\",\"adminDistrictCode\":\"IN\",\"adminDistrict\":\"Indiana\",\"countryCode\":\"US\",\"countryName\":\"UNITED STATES OF AMERICA\",\"headlineText\":\"River Flood Warning until FRI 1:00 AM CDT\",\"source\":\"National Weather Service\",\"disclaimer\":null,\"issueTimeLocal\":\"2019-06-26T21:30:00-05:00\",\"issueTimeLocalTimeZone\":\"CDT\",\"identifier\":\"19f5be234b4e87bcbf9bce6a1b5d2fba\",\"processTimeUTC\":1561602623}"));
  }

  getMomentValue(date: string): string {
    let myMoment: moment.Moment = moment(date);
    return myMoment.format("MMMM d");
  }
}
