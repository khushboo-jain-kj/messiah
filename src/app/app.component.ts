import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { debounceTime } from 'rxjs/operators';

import { WeatherService } from './services/weather.service';
import { NetworkService } from './services/network.service';

declare var windyInit: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  image: string = 'https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1';
  isConnected: boolean;
  public appPages = [
    {
      title: 'Home',
      url: '/alert',
      icon: 'home'
    },
    {
      title: 'Weather Map',
      url: '/home',
      icon: 'thunderstorm'
    },
    {
      title: 'Safe homes near me',
      url: '/list',
      icon: 'map'
    },
    {
      title: 'Talk to us',
      url: '/chatbot',
      icon: 'chatboxes'
    },
      {
      title: 'Community Forum',
      url: '/community-forum',
      icon: 'person'
    }
  ];

  constructor(
    public androidPermissions: AndroidPermissions,
    public locationAccuracy: LocationAccuracy,
    public geolocation: Geolocation,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private weatherService: WeatherService,
    public networkService: NetworkService,
    public router: Router,
    public _loc: Location
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.networkSubscriber();
      this.checkGPSPermission();

      let windyMapOptions = {
        key: 'vbuDH7tvzC2rHSjHyb4chnaNxzgT6OoD',
        zoom: 10,
      }
      new windyInit(windyMapOptions, windyAPI => {
        WeatherService.windyMap = windyAPI;
      });
    });
  }

  networkSubscriber(): void {
    this.networkService
      .getNetworkStatus()
      .pipe(debounceTime(300))
      .subscribe((connected: boolean) => {
        this.isConnected = connected;
        this.handleNotConnected(connected);
      });
  }
  handleNotConnected(connected) {
    if (!connected) {
      this.router.navigate(['/no-network']);
    } else {
      // this.router.navigate(['/alert']);
      this._loc.back();
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
}
