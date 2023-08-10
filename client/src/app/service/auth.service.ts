import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { CurrentUser } from '@shared-models/user.model'
import { environment } from '@environment/environment';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private accessToken: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    login(username: string, password: string): Observable<any> {
        return this.http.post<CurrentUser>(environment.apiUrl + '/auth/login', { username, password });
    }

  	logout(): void {
		this.removeRefreshToken();
		this.router.navigate(['/']);
	}

  	isLoggedIn(): boolean {
		if (this.isTokenValid(this.accessToken.getValue()))
			return true;
		const refreshToken = this.getRefreshToken();
		if (refreshToken && this.isTokenValid(refreshToken)) {
			try {
				this.refreshAccessToken(refreshToken);
				return true;
			} catch (e: any) {}
		}
		this.accessToken.next(undefined);
		this.removeRefreshToken();
		return false;         
  	}

	isTokenValid(token?: string): boolean {
		if (token) {
			const tokenInfo: JwtPayload = jwt_decode(token);
			const currentTime = Date.now() / 1000;
			return tokenInfo.exp !== undefined && tokenInfo.exp > currentTime;
		}
		return false;
	}

	removeRefreshToken() {	
		Cookies.remove("refreshToken");
	}

  	getRefreshToken(): string | undefined {
	    return Cookies.get("refreshToken");
  	}

	async refreshAccessToken(refreshToken: string) {
        const accessToken = await firstValueFrom(
			this.http.post<string>(environment.apiUrl + '/auth/refreshAccessToken', refreshToken)
		);
		if (!accessToken)
			throw new Error("Invalid refresh token.")
		this.accessToken.next(accessToken);
	}
}
