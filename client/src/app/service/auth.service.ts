import { environment } from '@environment/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

	getCurrentUserObs() {
		return this.currentUserSubject.asObservable();
	}

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/auth/login', { username, password });
    }

  	logout(): void {
		localStorage.removeItem('access_token');
		this.currentUserSubject.next(null);
		this.router.navigate(['/login']);
	}

  	isLoggedIn(): boolean {
		const token = localStorage.getItem('access_token');
		if (token) {
			const tokenInfo = jwt_decode(token);
			const currentTime = Date.now() / 1000;
			return tokenInfo.exp > currentTime;
		}
		return false;
  	}

  	saveToken(token: string): void {
	    localStorage.setItem('access_token', token);
    	const tokenInfo = jwt_decode(token);
    	this.currentUserSubject.next(tokenInfo);
  	}

  	getToken(): string | null {
	    return localStorage.getItem('access_token');
  	}
}
