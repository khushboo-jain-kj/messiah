import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { WeatherService } from '../../services/weather.service';

declare var google: any;
declare var Math: any;
declare var Object: any;

@Component({
  selector: 'app-navigate',
  templateUrl: 'navigateToSafeHome.html',
  styleUrls: ['navigateToSafeHome.scss']
})
export class NavigateToSafeHomePage implements OnInit {
  @ViewChild('map') mapElement: any;
  @ViewChild('nearbyMap') nearbyMapElement: any;
  map: any;
  markers: any;
  mapOptions: any;
  isKM: any = 15000;
  latLng: any;
  nearbyMapBool = true;
  allSafeHomes: any = [];
  nearestCount: any = 0;
  directionsDisplay: any;
  directionsService: any;
  polygonPts = [];
  insidePoly: any;

  constructor(public route: ActivatedRoute, public _googleMaps: GoogleMaps, public _geoloc: Geolocation) {

  }

  ngOnInit() {
    this.polygonPts = new Array<any>();
    this.route.queryParams
      .subscribe(params => {
        var polygon = JSON.parse(params['polygonData']);
        polygon.forEach(polyPts => {
          this.polygonPts.push(new LatLng(polyPts.lat, polyPts.lon));
        });

      });
    this.initMap();
    if (this.polygonPts) {
      this.insidePoly = this.pointInsidePolygon(this.polygonPts, WeatherService.locationCoords);
    }

    let loc: LatLng;
    if (WeatherService.locationCoords.lattitude && WeatherService.locationCoords.longitude) {
      loc = new LatLng(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude);
      this.getNearbyPlace(loc)

    } else {
      this.getLocation().then(res => {
        loc = new LatLng(res.coords.latitude, res.coords.longitude);
        this.getNearbyPlace(loc);
      }).catch(err => {
      });
    }

  }
  initMap() {
    if (!this.map) {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      if (this.polygonPts) {
        var poly = new google.maps.Polygon({
          paths: this.polygonPts,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        poly.setMap(this.map);
      }
      this.directionsDisplay.setMap(this.map);

    }

  }
  getLocation() {
    return this._geoloc.getCurrentPosition();
  }

  getNearbyPlace(loc: LatLng) {
    //loc.lat = 22.57;
    //loc.lng = 88.43;

    let nearby = new google.maps.Map(this.nearbyMapElement.nativeElement, this.mapOptions);
    let service = new google.maps.places.PlacesService(nearby);

    service.nearbySearch({
      location: loc,
      radius: this.isKM,
      types: ['hospital']
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        //  results = results.slice(0, 8);
        results.forEach(res => {
          this.allSafeHomes.push(res);
        });
      }
      this.NearestCity(loc.lat, loc.lng);
    });
    service.nearbySearch({
      location: loc,
      radius: this.isKM,
      types: ['school']
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(res => {
          this.allSafeHomes.push(res);
        });
      }
      this.NearestCity(loc.lat, loc.lng);
    });

    service.nearbySearch({
      location: loc,
      radius: this.isKM,
      types: ['supermarket']
    }, (results, status) => {

      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(res => {
          this.allSafeHomes.push(res);
        });

      }
      this.NearestCity(loc.lat, loc.lng);
    });

  }

  /// find closest safehome
  // Convert Degress to Radians
  Deg2Rad(deg) {
    return deg * Math.PI / 180;
  }

  PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = this.Deg2Rad(lat1);
    lat2 = this.Deg2Rad(lat2);
    lon1 = this.Deg2Rad(lon1);
    lon2 = this.Deg2Rad(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
  }

  NearestCity(latitude, longitude) {
    this.nearestCount = this.nearestCount + 1;
    if (this.nearestCount != 3) return;
    var minDif = 99999;
    var closest;

    for (let index = 0; index < this.allSafeHomes.length; ++index) {
      var dif = this.PythagorasEquirectangular(latitude, longitude, this.allSafeHomes[index].geometry.location.lat(), this.allSafeHomes[index].geometry.location.lng());
      if (this.polygonPts) {
        var insidePoly = this.pointInsidePolygon(this.polygonPts, { lattitude: this.allSafeHomes[index].geometry.location.lat(), longitude: this.allSafeHomes[index].geometry.location.lng() });
      }
      else {
        var insidePoly = false;
      }
      if (dif < minDif && !insidePoly) {
        closest = this.allSafeHomes[index];
        minDif = dif;
      }
    }
    this.calculateAndDisplayRoute(latitude, longitude, closest);
    this.nearestCount = 0;
  }

  calculateAndDisplayRoute(latitude, longitude, closest) {
    this.directionsService.route({
      origin: new LatLng(latitude, longitude),
      destination: new LatLng(closest.geometry.location.lat(), closest.geometry.location.lng()),
      travelMode: 'WALKING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        var infowindow3 = new google.maps.InfoWindow();
        var step = 1;
        infowindow3.setContent('<span style="color: #222;">' + response.routes[0].legs[0].steps[step].distance.text + '</span>' + "<br>" + '<span style="color: #222;">' + response.routes[0].legs[0].steps[step].duration.text + '</span>');
        infowindow3.setPosition(response.routes[0].legs[0].steps[step].end_location);
        infowindow3.open(this.map);
        var leg = response.routes[0].legs[0];
        var markerA = new google.maps.MarkerImage('../../../assets/user.png',
          new google.maps.Size(48, 48),
          new google.maps.Point(0, 0),
          new google.maps.Point(12, 27));
        var markerB = new google.maps.MarkerImage('../../../assets/school.png',
          new google.maps.Size(48, 48),
          new google.maps.Point(0, 0),
          new google.maps.Point(12, 28))
        var marker1 = new google.maps.Marker({
          position: leg.start_location,
          map: this.map,
          icon: markerA,
          title: 'You are here!'
        });
        var marker2 = new google.maps.Marker({
          position: leg.end_location,
          map: this.map,
          icon: markerB,
          title: 'Safe home'
        });
        var infowindow = new google.maps.InfoWindow({});
        infowindow.setContent('<span>You are here</span>');
        infowindow.open(this.map, marker1);
        var infowindow2 = new google.maps.InfoWindow({});
        infowindow2.setContent('<span>Safe home</span>');
        infowindow2.open(this.map, marker2);
        marker1.addListener('click', function () {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.setContent('<span>You are here</span>');
            infowindow.open(this.map, marker1);
          }

        });
        marker2.addListener('click', function () {
          if (infowindow2.getMap()) {
            infowindow2.close();
          } else {
            infowindow2.setContent('<span>Safe home</span>');
            infowindow2.open(this.map, marker2);
          }
        });
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  pointInsidePolygon(polygonPath, coordinates) {
    let numberOfVertexs = polygonPath.length - 1;
    let inPoly = false;

    let lastVertex = polygonPath[numberOfVertexs];
    let vertex1, vertex2;

    let x = coordinates.lattitude, y = coordinates.longitude;

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
