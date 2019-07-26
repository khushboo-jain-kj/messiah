import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { from } from 'rxjs';
import { UUID } from 'angular2-uuid';


@Injectable()
export class WeatherService {

    public static windyMap: any;
    public static chatSessionId: string;
    public static locationCoords: any = {};

    constructor(private http: Http) { }

    getWeatherByCord(lat: string, lon: string): Observable<any> {
        return this.http.get('https://api.weather.com/v3/wx/observations/current?geocode=' + lat + ',' + lon + '&units=m&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getPlacesByName(name: string): Observable<any> {
        return this.http.get('https://api.weather.com/v3/location/search?query=' + name + '&locationType=city&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getNewsByCord(lat: string, lon: string): Observable<any> {
        //   return this.http.get('https://api.weather.com/v3/alerts/headlines?geocode=' + lat + ',' + lon + '&format=json&language=en-US&apiKey=320c9252a6e642f38c9252a6e682f3c6');
        return Observable.create(function (observer) {
            // observer.next([{
            //     tone: null,
            //     detailKey: "17af8d53-1105-339c-a034-67473d45e74d",
            //     eventDescription: "Cyclone Warning",
            //     issueTimeLocal: "2019-07-03T03:03:00-04:00",
            //     isOpen: 0,
            //     detail: null,
            //     severity: "Moderate",
            //     type: 'Cyclone'
            // },]);
            observer.next([{
                tone: null,
                detailKey: "ff4fd233-3e9d-35d0-8681-43a82e7b388c",
                eventDescription: "Flood Warning",
                issueTimeLocal: "2019-07-03T03:03:00-04:00",
                isOpen: 0,
                detail: null,
                severity: "Moderate",
                type: 'Flood',
                polygon: [{ "lat": 40.78, "lon": -95.87 }, { "lat": 40.78, "lon": -95.72 }, { "lat": 40.48, "lon": -95.54 }, { "lat": 40.48, "lon": -95.80 }, { "lat": 40.74, "lon": -95.90 }, { "lat": 40.78, "lon": -95.87 }]
            }]);
        });
    }

    getNewsDetails(key: string): Observable<any> {
        //  return this.http.get('https://api.weather.com/v3/alerts/detail?alertId=' + key + '&format=json&language=en-US&apiKey=320c9252a6e642f38c9252a6e682f3c6');
        return Observable.create(function (observer) {
            observer.next({
                texts: [{
                    description: "The Flood Warning continues for\nThe Missouri River At Nebraska City.\n* At  8:00 PM Wednesday the stage was 20.4 feet...or 2.4 feet above\nflood stage.\n* Flood stage is 18.0 feet.\n* Minor flooding is occurring and Minor flooding is forecast.\n* Forecast...The river should be nearly steady overnight, then\nbegin to slowly fall.\n\n&&\n\n\n\nThe Flood Warning continues for...\n\nMissouri River at Plattsmouth affecting Mills and Cass Counties.\n\nMissouri River At Nebraska City affecting Fremont and Otoe\nCounties.\n\nMissouri River At Brownville affecting Atchison and Nemaha\nCounties.\n\nMissouri River At Rulo affecting Holt and Richardson Counties.\n\nPRECAUTIONARY/PREPAREDNESS ACTIONS...\n\nDo not drive cars through areas where water covers the road.  The\nwater depth may be too great to allow your vehicle to pass safely.\nTurn around...don't drown!\n\n",
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

    connectToMessiah(model: string): any {
        return this.http.get('http://192.168.11.4/?p=' + btoa(model) + '|' + WeatherService.locationCoords.lattitude + ',' +
            WeatherService.locationCoords.longitude + '|' + UUID.UUID());
    }

    getLocationNameByCoordinates(lat: string, lon: string): Observable<any> {
        return this.http.get('https://api.weather.com/v3/location/search?query=' + lat + ',' + lon + '&locationType=geocode&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }
}