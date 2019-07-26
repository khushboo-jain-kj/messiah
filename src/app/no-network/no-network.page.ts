import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../services/weather.service';


import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-no-network',
  templateUrl: './no-network.page.html',
  styleUrls: ['./no-network.page.scss'],
})
export class NoNetworkPage implements OnInit {

  problem: string;
  constructor(public weatherService: WeatherService, public alertController: AlertController) { }

  ngOnInit() {
  }

  messiahConnect() {
    this.weatherService.connectToMessiah(this.problem).subscribe(resp => {
        this.presentAlert('Alert',
          'Your message with your present location has been sent to the server.Please wait for further reinforcement! ');
this.problem='';  
  });
    
  }

  async presentAlert(headerText: string, message: string) {
    const alert = await this.alertController.create({
      header: headerText,
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }
}
