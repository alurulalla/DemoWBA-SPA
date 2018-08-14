import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BotResponse } from '../_models/BotResponse';

@Injectable()
export class WBABotService {
    // constructor(private http: Http) {}
    constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) {}
    //private http: HttpClient
    // private getHeaders() {
    //     let headers = new Headers();
    //     headers.append('Accept', 'application/json');
    //     return headers;
    // }

    // private getPostHeaders() {
    //     return new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;odata=verbose;charset=UTF-8' });
    // }

    GetBotResponse(query: string, imgUrl: string){
        let response = this.http
        .get<BotResponse>(`http://storeassistant.azurewebsites.net/api/StoreAssistant?message=${query}&image=${imgUrl}`);
        
    return response;
    }

}