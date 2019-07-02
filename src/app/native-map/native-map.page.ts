import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent, Marker, MarkerOptions, ILatLng, Polygon } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WeatherService } from '../services/weather.service';


@Component({
  selector: 'app-native-map',
  templateUrl: './native-map.page.html',
  styleUrls: ['./native-map.page.scss'],
})
export class NativeMapPage implements OnInit {
  @ViewChild('map') mapElement: any;
  disaster: any;
  map: GoogleMap;
  polygonPts: ILatLng[];
  insidePoly: any;
  constructor(public route: ActivatedRoute, public _googleMaps: GoogleMaps, public _geoloc: Geolocation) { }

  ngOnInit() {
    this.polygonPts = new Array<LatLng>();
    this.route.queryParams
      .subscribe(params => {
        this.disaster = params['disaster'];
        this.disaster.disasterAreaPolygonCoordinates.forEach(polyPts => {
          this.polygonPts.push(new LatLng(polyPts.lat, polyPts.lon));
        });

      });
    this.initMap();

    this.insidePoly = this.pointInsidePolygon(this.polygonPts, WeatherService.locationCoords);
    let loc: LatLng;

    if (WeatherService.locationCoords.lattitude && WeatherService.locationCoords.longitude) {
      loc = new LatLng(WeatherService.locationCoords.lattitude,WeatherService.locationCoords.longitude);
      this.moveCamera(loc);
      this.createMarker(loc, 'You are here').then((marker: Marker) => {
        marker.showInfoWindow();
      }).catch(err => {
        console.log(err);
      });
    } else {
      this.getLocation().then(res => {
        loc = new LatLng(res.coords.latitude, res.coords.longitude);

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
        target: this.polygonPts,
        zoom: 10
      }
    });
    let polygon: Polygon = this.map.addPolygonSync({
      'points': this.polygonPts,
      'strokeColor': '#FF453A',
      'fillColor': '#FF453A',
      'strokeWidth': 10
    });

  }

  getLocation() {
    return this._geoloc.getCurrentPosition();
  }

  moveCamera(loc: LatLng) {
    let options = {
      target: loc,
      zoom: 10
    }
    this.map.moveCamera(options);
  }

  createMarker(loc: LatLng, title: string) {
    let markerOptions: MarkerOptions = { position: loc, title: title };
    return this.map.addMarker(markerOptions);
  }

  pointInsidePolygon(polygonPath, coordinates) {
    let numberOfVertexs = polygonPath.length - 1;
    let inPoly = false;

    let lastVertex = polygonPath[numberOfVertexs];
    let vertex1, vertex2;

    let x = coordinates.lat, y = coordinates.lng;

    let inside = false;
    for (var i = 0, j = polygonPath.length - 1; i < polygonPath.length; j = i++) {
      let xi = polygonPath[i].lat, yi = polygonPath[i].lng;
      let xj = polygonPath[j].lat, yj = polygonPath[j].lng;

      let intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }
}
