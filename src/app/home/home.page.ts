import { Component, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  encapsulation: ViewEncapsulation.None
})


export class HomePage {
  windyMapOptions: any;
  mapHidden = true;
  windyMap: any;
  windyMarkers: any;
  // locationCoords: any;
  autocomplete: any;
  autocompleteItems: any = [];
  // newsData: any = [];

  constructor(public androidPermissions: AndroidPermissions, public locationAccuracy: LocationAccuracy,
    public geolocation: Geolocation, private weatherService: WeatherService) {

    //  this.locationCoords = {};
    this.autocomplete = '';
    this.autocompleteItems = [];
  }

  ionViewDidEnter() {
    document
      .getElementById('windycontainer')
      .appendChild(document.getElementById('windy'));
    // if (!WeatherService.locationCoords.lattitude && !WeatherService.locationCoords.longitude) {
    //   this.checkGPSPermission();
    // }


    setTimeout(() => {
      this.windyMap = WeatherService.windyMap;
      this.setWindyMap(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude);
    }, 3000);
  }

  ionViewDidLeave() {
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
  }

  setOverlayMap(type: string) {
    this.windyMap.store.set('overlay', type);
  }

 
  updateSearchResults(event) {
    setTimeout(() => {
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
    }, err => { });
  }
}
