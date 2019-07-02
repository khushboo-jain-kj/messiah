import { Component, ViewChild, OnInit } from '@angular/core';

import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { WeatherService } from '../services/weather.service';

declare var google: any;

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  @ViewChild('map') mapElement: any;
  @ViewChild('nearbyMap') nearbyMapElement: any;
  map: GoogleMap;
  markers: any;
  mapOptions: any;
  isKM: any = 5000;
  isType: any = "";
  latLng: any;
  nearbyMapBool = true;

  constructor(public _googleMaps: GoogleMaps, public _geoloc: Geolocation) {

  }

  ngOnInit() {
    this.initMap();

    let loc: LatLng;

    if (WeatherService.locationCoords.lattitude && WeatherService.locationCoords.longitude) {
      loc = new LatLng(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude);
      this.getNearbyPlace(loc);
      this.moveCamera(loc);
      this.createMarker(loc, 'You are here').then((marker: Marker) => {
        marker.showInfoWindow();
      }).catch(err => {
        console.log(err);
      });
    } else {
      this.getLocation().then(res => {
        loc = new LatLng(res.coords.latitude, res.coords.longitude);
        this.getNearbyPlace(loc);
        this.moveCamera(loc);
        this.createMarker(loc, 'You are here').then((marker: Marker) => {
          marker.showInfoWindow();
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    }

  }

  initMap() {
    this.map = GoogleMaps.create('map', {
      camera: {
        target: new LatLng(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude),
        zoom: 15
      }
    });

  }

  getLocation() {
    return this._geoloc.getCurrentPosition();
  }

  moveCamera(loc: LatLng) {
    let options = {
      target: loc,
      zoom: 15
    }
    this.map.moveCamera(options);
  }

  createMarker(loc: LatLng, title: string) {
    let markerOptions: MarkerOptions = { position: loc, title: title };
    return this.map.addMarker(markerOptions);
  }

  getNearbyPlace(loc: LatLng) {
     loc.lat = 22.57;
     loc.lng = 88.43;
    let nearby = new google.maps.Map(this.nearbyMapElement.nativeElement, this.mapOptions);
    let service = new google.maps.places.PlacesService(nearby);
    service.nearbySearch({
      location: loc,
      radius: this.isKM,
      types: ['hospital']
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          let photo = place.icon;
          if (place.photos) {
            let photos_list = place.photos;
            photo = photos_list[0].getUrl({ 'maxWidth': 35, 'maxHeight': 35 })
          }

          let markerOptions: MarkerOptions = { position: new LatLng(place.geometry.location.lat(), place.geometry.location.lng()), title: place.name, icon: "https://maps.google.com/mapfiles/ms/icons/pink-dot.png" };
          this.map.addMarker(markerOptions);
        }
      }
    });
    service.nearbySearch({
      location: loc,
      radius: this.isKM,
      types: ['school']
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          let photo = place.icon;
          if (place.photos) {
            let photos_list = place.photos;
            photo = photos_list[0].getUrl({ 'maxWidth': 35, 'maxHeight': 35 })
          }

          let markerOptions: MarkerOptions = { position: new LatLng(place.geometry.location.lat(), place.geometry.location.lng()), title: place.name, icon: "https://maps.google.com/mapfiles/ms/icons/pink-dot.png" };
          this.map.addMarker(markerOptions);
        }
      }
    });
  }
}
