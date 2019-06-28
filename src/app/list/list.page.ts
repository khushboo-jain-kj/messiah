import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements AfterViewInit {
  @ViewChild('map') mapElement: any;
  @ViewChild('nearbyMap') nearbyMapElement: any;
  map: GoogleMap;
  markers: any;
  mapOptions: any;
  isKM: any = 1000;
  isType: any = "";
  latLng: any;
  nearbyMapBool = true;

  constructor(public _googleMaps: GoogleMaps, public _geoloc: Geolocation) {

  }
  ngAfterViewInit() {
    let loc: LatLng;
    this.initMap();
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.getLocation().then(res => {
        loc = new LatLng(res.coords.latitude, res.coords.longitude);

        this.moveCamera(loc);
        this.createMarker(loc, "Me").then((marker: Marker) => {
          marker.showInfoWindow();
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    });
  }
  initMap() {
    let element = this.mapElement.nativeElement;
   this.map = GoogleMaps.create('map', {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    });
  }

  getLocation() {
    return this._geoloc.getCurrentPosition();
  }

  moveCamera(loc: LatLng) {
    let options = {
      target: loc,
      zoom: 15,
      tilt: 10
    }
    this.map.moveCamera(options);
  }

  createMarker(loc: LatLng, title: string) {
    let markerOptions: MarkerOptions = { position: loc, title: title };
    return this.map.addMarker(markerOptions);
  }


  nearbyPlace() {
    // let lat: any = 22.57;
    // let lng: any = 88.43;
    // this.weatherService.getWeather(lat, lng).subscribe(data => {
    //   console.log(data);
    // });
    // let loc: any;
    // this.getLocation().then(res => {
    //   loc = new LatLng(res.coords.latitude, res.coords.longitude);

    //   this.mapOptions = {
    //     center: loc,
    //     zoom: 14,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP
    //   }

    //   let nearby = new google.maps.Map(this.nearbyMapElement.nativeElement, this.mapOptions);
    //   let service = new google.maps.places.PlacesService(nearby);
    //   service.nearbySearch({
    //     location: loc,
    //     radius: this.isKM,
    //     types: ['hospital']
    //   }, (results, status) => {
    //     this.callback(results, status);
    //   });
    // }, (err) => {
    //   alert('err ' + err);
    // });

  }
}
