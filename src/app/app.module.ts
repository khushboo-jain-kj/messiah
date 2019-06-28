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

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { WeatherService } from './services/weather.service';

@NgModule({
  declarations: [AppComponent],
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
