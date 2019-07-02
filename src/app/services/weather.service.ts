import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {

    public static windyMap: any;
    public static chatSessionId: string;
    public static locationCoords:any={};

    constructor(private http: Http) { }

    getWeatherByCord(lat: string, lon: string): Observable<any> {
        return this.http.get('https://api.weather.com/v3/wx/observations/current?geocode=' + lat + ',' + lon + '&units=m&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getPlacesByName(name: string): Observable<any> {
        return this.http.get('https://api.weather.com/v3/location/search?query=' + name + '&locationType=city&language=en-US&format=json&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getNewsByCord(lat: string, lon: string): Observable<any> {
        return this.http.get('https://api.weather.com/v3/alerts/headlines?geocode=' + lat + ',' + lon + '&format=json&language=en-US&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    getNewsDetails(key: string) {
        return this.http.get('https://api.weather.com/v3/alerts/detail?alertId=' + key + '&format=json&language=en-US&apiKey=320c9252a6e642f38c9252a6e682f3c6');
    }

    createChatSession() {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/CreateChatSession.json');
    }

    sendBotMessage(sessionId: string, message: string) {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/SendIbmWatsonMessage.json?sessionId=' + sessionId + "&message=" + message);
    }

    getSentimentByMessage(message: string) {
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

    getDisasterImageAnalysisData() {
        
    }
}