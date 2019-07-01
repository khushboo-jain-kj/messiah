import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
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
      title: 'Places near me',
      url: '/list',
      icon: 'map'
    },
    {
      title: 'Talk to us',
      url: '/chatbot',
      icon: 'chatboxes'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private weatherService: WeatherService,
    public networkService: NetworkService,
    public router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.networkSubscriber();

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
      this.router.navigate(['/alert']);
    }
  }
}
