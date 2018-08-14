import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthUser } from '../_models/AuthUser';
import { map } from 'rxjs/operators';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    baseUrl = 'https://wba1-app.azurewebsites.net/api/auth/';
    //baseUrl = 'http://localhost:5000/api/auth/';
    userToken: any;
    decodedToken: any;
    currentUser: User;

    constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) {}

    login(model: any) {
        return this.http.post<AuthUser>(this.baseUrl + 'login', model, { headers: new HttpHeaders()
            .set('Content-Type', 'application/json')})
            .pipe(
                map((user) => {
                    if (user) {
                        localStorage.setItem('token', user.tokenString);
                        localStorage.setItem('user', JSON.stringify(user.user));
                        this.decodedToken = this.jwtHelperService.decodeToken(user.tokenString);
                        this.currentUser = user.user;
                        this.userToken = this.userToken;
                    }
                })
            )
    }

    register(user: User) {
        return this.http.post(this.baseUrl + 'register', user, { headers: new HttpHeaders()
            .set('Content-Type', 'application/json')});
    }

    loggedIn() {
        const token = this.jwtHelperService.tokenGetter();

        if (!token) {
            return false;
        }
        this.decodedToken = this.jwtHelperService.decodeToken(token);
        return !this.jwtHelperService.isTokenExpired(token);
    }
}