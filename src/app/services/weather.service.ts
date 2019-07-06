import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { from } from 'rxjs';


@Injectable()
export class WeatherService {

    public static windyMap: any;
    public static chatSessionId: string;
    public static locationCoords: any = {};

    constructor(private http: Http, private httpNative: HTTP) { }

    getWeatherByCord(lat: string, lon: string): Observable<any> {
        return this.http.get('https://api.weather.com/v3/wx/observations/current?geocode=' + lat + ',' + lon + '&units=m&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getPlacesByName(name: string): Observable<any> {
        return this.http.get('https://api.weather.com/v3/location/search?query=' + name + '&locationType=city&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getNewsByCord(lat: string, lon: string): Observable<any> {
        //   return this.http.get('https://api.weather.com/v3/alerts/headlines?geocode=' + lat + ',' + lon + '&format=json&language=en-US&apiKey=320c9252a6e642f38c9252a6e682f3c6');
        return Observable.create(function (observer) {
            observer.next([{
                tone: null,
                detailKey: "17af8d53-1105-339c-a034-67473d45e74d",
                eventDescription: "Cyclone Warning",
                issueTimeLocal: "2019-07-03T03:03:00-04:00",
                isOpen: 0,
                detail: null,
                severity: "Moderate"
            }]);
        });
    }

    getNewsDetails(key: string): Observable<any> {
        //  return this.http.get('https://api.weather.com/v3/alerts/detail?alertId=' + key + '&format=json&language=en-US&apiKey=320c9252a6e642f38c9252a6e682f3c6');
        return Observable.create(function (observer) {
            observer.next({
                texts: [{
                    description: "The National Weather Service in Wilmington has issued a\n\n* Flood Advisory for...\nNortheastern Auglaize County in west central Ohio...\nSouthwestern Hardin County in west central Ohio...\n\n* Until 900 AM EDT.\n\n* At 302 AM EDT, radar indicated thunderstorms with heavy rain were\nmoving back into the region. These thunderstorms are producing\nabout an inch of rain in an hour.\n\n* Minor flooding of low-lying and poorly drained streets, highways\nand underpasses will occur. In addition, farmland near creeks,\nstreams and drainage ditches will experience minor flooding.\n\nSome locations that will experience minor flooding include...\nFort Shawnee, Alger, Waynesfield, Roundhead, Uniopolis, New\nHampshire, St. Johns and State Route 195 at State Route 235.\n\nPRECAUTIONARY/PREPAREDNESS ACTIONS...\n\nTurn around, don't drown when encountering flooded roads. Most flood\ndeaths occur in vehicles.\n\nTo report flooding, go to our website at weather.gov/iln and submit\nyour report via social media, when you can do so safely.",
                    source: "National Weather Service"
                }]
            });
        });
    }

    createChatSession() {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/CreateChatSession.json');
    }

    sendBotMessage(sessionId: string, message: string) {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/SendIbmWatsonMessage.json?sessionId=' + sessionId + "&message=" + message);
    }

    getSentimentByMessage(message: string): Observable<any> {
        return this.http.get("https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/GetMessageSentiment.json?message=" + message);
    }

    getPowerDisruptionForecast(lattitude: any, longitude: any) {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/GetPowerDisruptionDataByCoordinates.json?lattitude=' + lattitude + "&longitude=" + longitude)
    }

    getNLPDataFromText(message: string) {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/GetNLPDataFromText.json?message=' + message);
    }

    sendSms(message: string, recipentString: string) {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/SendMessageService.json?message=' + message + "&phoneTo=" + recipentString);
    }

    getPlaceDetailsByGeoCode(lattitude: string, longitude: string) {
        return this.http.get('https://api.weather.com/v3/location/search?query=' +
            lattitude + ',' +
            longitude +
            '&locationType=geocode&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getFloodPredictionMlData() {
        // To do pass the proper values calculated
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Ankita.Ghosh%40cognizant.com_dev/default/GetFloodPredictionV1.json');
    }

    getDisasterImageAnalysisData(image: string) {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/GetSatlliteImageVisualRecognitionData.json?url=https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Gita_2018-02-14_0150Z.jpg/260px-Gita_2018-02-14_0150Z.jpg').pipe(delay(3500));
    }

    getRainfallData(lattitude: string, longitude: string) {
        return this.http.get('https://api.weather.com/v3/wx/conditions/historical/dailysummary/30day?geocode=' + lattitude + '%2C' + longitude + '&units=m&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getFloodPercentage(AVG_RAINFALL_LAST_10_DAY: number, MARCH_TO_MAY_RAINFALL_AVG: number, AVERAGE_INCREASE_RAINFALL_MAY_TO_JUNE: number) {
        return this.http.get("https://eu-gb.functions.cloud.ibm.com/api/v1/web/Ankita.Ghosh%40cognizant.com_dev/default/GetFloodPredictionML.json?params.AVG_RAINFALL_LAST_10_DAY="
            + AVG_RAINFALL_LAST_10_DAY + "&MARCH_TO_MAY_RAINFALL_AVG=" + MARCH_TO_MAY_RAINFALL_AVG + "&AVERAGE_INCREASE_RAINFALL_MAY_TO_JUNE=" + AVERAGE_INCREASE_RAINFALL_MAY_TO_JUNE
        ).pipe(delay(3500));
    }

    checkNetworkConnectivity(): Observable<any> {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/GetInternetConnectivity.json');
    }

    connectToMessiah(type: number): any {
        return this.httpNative.get('http://192.168.4.1/LED_1/' + (type === 1 ? 'off' : 'on'), {}, {});
    }
}