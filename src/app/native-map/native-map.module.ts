import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NativeMapPage } from './native-map.page';
import { GoogleMaps } from '@ionic-native/google-maps';

const routes: Routes = [
  {
    path: '',
    component: NativeMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NativeMapPage],
  providers:[GoogleMaps]
})
export class NativeMapPageModule {}
