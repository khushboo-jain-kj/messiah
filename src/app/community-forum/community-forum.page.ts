import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../services/community.service';
import { WeatherService } from '../services/weather.service';

class Communitydata {
  public userName: string = '';
  public age: string = '';
  public address: string = '';
  public phoneNumber: string = '';
  public markSafe: number = 0;
  public imageUrl: string = '';
  public uploadedByName: string = '';
  public uploadedDate: string = '';
  public uploadedByPhnNum: string = '';
  public isMsgSent: number = 0;
  public sendPhnNum: string = '';
  public senderName: string = '';
  public safeLocation: string = '';
  public authToken: string = '';
}
@Component({
  selector: 'app-community-forum',
  templateUrl: './community-forum.page.html',
  styleUrls: ['./community-forum.page.scss'],
})

export class CommunityForumPage implements OnInit {
  dataToAdd: Communitydata;
  listData: Array<Communitydata>;

  constructor(public communityService: CommunityService, public weatherService: WeatherService) {
    this.dataToAdd = new Communitydata();
    this.listData = new Array<Communitydata>();
  }

  ngOnInit() {
    this.getAllData();
  }


  getAllData() {
    this.dataToAdd.address='';
    this.communityService.getCommunityDetails().subscribe(data => {
      this.listData = data.json().body;
    })
  }

  addToList() {
    this.communityService.addData(this.dataToAdd.address).subscribe(data => {
      this.getAllData();
    })
  }

}
