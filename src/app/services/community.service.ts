import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { from } from 'rxjs';


@Injectable()
export class CommunityService {


    constructor(private http: Http) { }

    getCommunityDetails(): Observable<any> {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/GetIncidentData.json');
    }

    getToken(): Observable<any> {
        return this.http.get('https://messiah.eu-gb.mybluemix.net/api/values/RetrieveAuthToken');
    }

    addData(dataToAdd: any): Observable<any> {
        return this.http.get('https://eu-gb.functions.cloud.ibm.com/api/v1/web/Khushboo.Jain%40cognizant.com_dev/default/InsertIncidentData.json?ms=1&address=' + dataToAdd);
    }
}