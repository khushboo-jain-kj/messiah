import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpModule } from '@angular/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Network } from '@ionic-native/network/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { HTTP } from '@ionic-native/http/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { WeatherService } from './services/weather.service';
import { NetworkService } from './services/network.service';
import { CommunityService } from './services/community.service';
import {NavigateToSafeHomePage} from './alert/navigateToSafeHome/navigateToSafeHome';

@NgModule({
  declarations: [AppComponent,NavigateToSafeHomePage],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
     AndroidPermissions,
    Geolocation,
    LocationAccuracy,
    GoogleMaps,
    Network,
    Camera,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    WeatherService,
    NetworkService,
    CommunityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
