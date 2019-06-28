import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as moment from 'moment';
import { WeatherService } from '../services/weather.service';

declare var L: any;
declare var windyInit: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
  windyMapOptions: any;
  mapHidden = true;
  windyMap: any;
  windyMarkers: any;
  locationCoords: any;
  autocomplete: any;
  autocompleteItems: any = [];
  weatherData: any;
  newsData: any = [];

  constructor(public androidPermissions: AndroidPermissions, public locationAccuracy: LocationAccuracy,
    public geolocation: Geolocation, private weatherService: WeatherService) {
    
    this.locationCoords = {};
    this.autocomplete = '';
    this.autocompleteItems = [];
  }

  ionViewDidEnter() {
    document
    .getElementById('windycontainer')
    .appendChild(document.getElementById('windy'));

    this.checkGPSPermission();
    
    setTimeout(() => {
      this.windyMap = WeatherService.windyMap;
      this.setWindyMap('22.57', '88.43');
    }, 3000);
  }

  ionViewDidLeave(){
    document
  .getElementById('container')
  .appendChild(document.getElementById('windy'));
  }

  setWindyMap(lat, lng) {
    if (this.windyMarkers) {
      this.windyMap.map.removeLayer(this.windyMarkers);
    }
    this.windyMarkers = L.marker([lat, lng]).addTo(this.windyMap.map);
    this.windyMap.map.setView([lat, lng], 8);

    this.weatherService.getWeatherByCord(lat, lng).subscribe(res => {
      this.weatherData = res.json();
    }, err => { });

    this.newsData = [];
    this.weatherService.getNewsByCord(lat, lng).subscribe(res => {
      let data = res.json();
      if (!data) return;
      for (let i = 0; i < data.alerts.length; i++) {
        this.newsData.push(
          {
            news: data.alerts[i].headlineText,
            area: data.alerts[i].areaName,
            key: data.alerts[i].detailKey
          });
      }
    }, err => { });
  }

  setOverlayMap(type: string) {
    this.windyMap.store.set('overlay', type);
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

  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      this.setWindyMap(this.locationCoords.latitude, this.locationCoords.longitude);
    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }

  updateSearchResults(event) {
    setTimeout(() => {
      console.log(this.autocomplete);
      if (this.autocomplete == '') {
        this.autocompleteItems = [];
        return;
      }
      this.autocompleteItems = [];
      this.weatherService.getPlacesByName(this.autocomplete).subscribe(res => {
        this.autocompleteItems = [];
        let data = res.json();
        if (data && data.location) {
          for (let i = 0; i < data.location.address.length; i++) {
            this.autocompleteItems.push(
              {
                desc: data.location.address[i],
                lat: data.location.latitude[i],
                lon: data.location.longitude[i]
              });
          }
        }
      }, err => {
        this.autocompleteItems = [];
      });
    }, 500);
  }

  selectSearchResult(item) {
    this.autocomplete = item.desc;
    this.setWindyMap(item.lat, item.lon);
    this.autocompleteItems = [];
  }

  openHeadline(news) {
    this.weatherService.getNewsDetails(news.key).subscribe(res => {
      console.log(res.json());
    }, err => { });
  }
}
