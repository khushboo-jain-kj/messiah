import { Component, OnInit } from '@angular/core';
class Communitydata {
  public text: string;
  public time: string;
  public image: string;
  public type: string;
}
@Component({
  selector: 'app-community-forum',
  templateUrl: './community-forum.page.html',
  styleUrls: ['./community-forum.page.scss'],
})

export class CommunityForumPage implements OnInit {
  dataToAdd: Communitydata;
  listData: Array<Communitydata>;
  constructor() {
    this.dataToAdd = new Communitydata();
    this.dataToAdd.image = null;
    this.dataToAdd.text = '';
    this.dataToAdd.time = null;
    this.listData = new Array<Communitydata>();
  }

  ngOnInit() {
    let com=new Communitydata();
    
    this.listData.push({
      text: "person named ankita ghosh is missing from technopolis. If found please contact at 1234567890",
      time: "03/07/2019",
      type: "0",
      image: "null"
    });
  }

  addToList() {

  }

}
