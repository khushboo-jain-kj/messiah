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
  public communityDataType: string = '';
  public reportDataString: string = '';
  public reportedByRelation: string = '';
  public reportedDataTone: string = '';
}
@Component({
  selector: 'app-community-forum',
  templateUrl: './community-forum.page.html',
  styleUrls: ['./community-forum.page.scss'],
})

export class CommunityForumPage implements OnInit {
  dataToAdd: Communitydata;
  listData: Array<Communitydata>;
  nlpQualifiedList: Array<Communitydata>;
  communityDataType: Array<any> = [];
  deviceLocationCoord: any;
  unFilteredAllNlpList: Array<Communitydata>;

  constructor(public communityService: CommunityService, public weatherService: WeatherService) {
    this.dataToAdd = new Communitydata();
    this.listData = new Array<Communitydata>();
    this.nlpQualifiedList = new Array<Communitydata>();
    this.unFilteredAllNlpList = new Array<Communitydata>();
    this.communityDataType = new Array<any>();
  }

  ngOnInit() {
    this.getAllData();
  }


  getAllData() {
    this.dataToAdd.address = '';
    this.nlpQualifiedList = [];
    this.communityService.getCommunityDetails().subscribe(data => {
      this.listData = data.json().body;
      this.listData.forEach(element => {
        if (element.age === '1') {
          this.weatherService.getNLPDataFromText(element.address).subscribe(result => {
            let nlpResult = result.json();
            this.populateNlpQualifiedData(nlpResult, element);
          });
        }
      });
    })
  }

  addToList() {
    this.communityService.addData(this.dataToAdd.address).subscribe(data => {
      this.getAllData();
    })
  }

  populateNlpQualifiedData(nlpResult: any, originalObject: Communitydata) {
    let dataObj: Communitydata = new Communitydata();
    dataObj.reportDataString = originalObject.address;
    dataObj.communityDataType = 'General';
    // Analyse on the entities
    if (nlpResult && nlpResult.entities && nlpResult.entities.length > 0) {
      nlpResult.entities.forEach(entity => {
        if (entity.type.toUpperCase() === 'PERSON') {
          dataObj.userName = entity.text;
          dataObj.imageUrl = "https://live.staticflickr.com/4139/4922915062_e148f72bcd_b.jpg";
          dataObj.communityDataType = 'Missing';
        }

        if (entity.type.toUpperCase() === 'LOCATION' || entity.type === 'GeographicFeature' || entity.type === 'Facility') {
          dataObj.address = entity.text;
        }
      });
    }

    if (dataObj.address === '') {
      this.deviceLocationCoord = WeatherService.locationCoords;
      this.weatherService.getLocationNameByCoordinates(WeatherService.locationCoords.lattitude, WeatherService.locationCoords.longitude).subscribe(result => {
        dataObj.address = result.json().location && result.json().location.address && result.json().location.address.length > 0 ? result.json().location.address[0] : '';
      });
    }

    this.weatherService.getSentimentByMessage(originalObject.address).subscribe(tones => {
      let tone: string = '';
      let maxVal: number = 0;
      let resp = tones.json();
      resp.document_tone.tones.forEach(tn => {
        if (tn.score > maxVal) {
          tone = tn.tone_name;
          maxVal = tn.score;
        }
      });
      dataObj.reportedDataTone = tone;
    });

    // Analyse on the relations
    if (nlpResult && nlpResult.relations && nlpResult.relations.length > 0) {
      nlpResult.relations.forEach(relation => {
        if (relation.type === 'hasAttribute' && relation.sentence.toUpperCase().indexOf('AGE') >= 0) {
          relation.arguments.forEach(arg => {
            var numberPattern = /[0-9]/g;
            if (arg.text.match(numberPattern)) {
              dataObj.age = arg.text;
            }
          });
        }
      });
    }

    this.nlpQualifiedList.push(dataObj);
    if (this.communityDataType.findIndex(x => x.type === dataObj.communityDataType) === -1) {
      this.communityDataType.push({ type: dataObj.communityDataType, selected: true });
    }

    this.unFilteredAllNlpList = [...this.nlpQualifiedList];
  }

  checkBoxChanged(event) {
    this.nlpQualifiedList = [];
    this.unFilteredAllNlpList.forEach(allData => {
      this.communityDataType.forEach(com => {
        if (com.selected && allData.communityDataType===com.type) {
          this.nlpQualifiedList.push(allData);
        }
      });
    })

  }
}
