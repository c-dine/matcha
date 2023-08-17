import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AuthenticatedUser, CurrentUser, NewUser } from '@shared-models/user.model'
import { environment } from '@environment/environment';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private currentUserSubject: BehaviorSubject<CurrentUser | undefined> = new BehaviorSubject<CurrentUser | undefined>(undefined);
	private accessTokenSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

	getAccessTokenObs() {
		return this.accessTokenSubject.asObservable();
	}

	async signIn(newUser: NewUser): Promise<AuthenticatedUser | undefined>  {
		const userData = await firstValueFrom(
			this.http.post<AuthenticatedUser | undefined>(environment.apiUrl + '/auth/signIn', newUser)
		);
		if (userData)
			this.setSession(userData);
		return userData;
	}

    async login(userAuthData: { username: string, password: string }): Promise<AuthenticatedUser | undefined> {
        const userData = await firstValueFrom(
			this.http.post<AuthenticatedUser | undefined>(environment.apiUrl + '/auth/logIn', userAuthData)
		);
		if (userData)
			this.setSession(userData);
		return userData;
    }

	setSession(user: AuthenticatedUser) {
		this.setRefreshToken(user.token.refresh);
		this.accessTokenSubject.next(user.token.refresh);
		this.currentUserSubject.next(user as CurrentUser);
	}

  	logout(): void {
		this.accessTokenSubject.next(undefined);
		this.removeRefreshToken();
		this.router.navigate(['/']);
	}

  	async isLoggedIn(): Promise<boolean> {
		if (this.isTokenValid(this.accessTokenSubject.getValue()))
			return true;
		const refreshToken = this.getRefreshToken();
		if (refreshToken && this.isTokenValid(refreshToken)) {
			try {
				await this.refreshAccessToken(refreshToken);
				return true;
			} catch (e: any) {}
		}
		this.accessTokenSubject.next(undefined);
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

	setRefreshToken(token: string) {
		Cookies.set("refreshToken", token);
	}

	removeRefreshToken() {	
		Cookies.remove("refreshToken");
	}

  	getRefreshToken(): string | undefined {
	    return Cookies.get("refreshToken");
  	}

	async refreshAccessToken(refreshToken: string) {
        const accessToken = await firstValueFrom(
			this.http.post<string>(environment.apiUrl + '/auth/refreshAccessToken', { refreshToken })
		);
		if (!accessToken)
			throw new Error("Invalid refresh token.")
		this.accessTokenSubject.next(accessToken);
	}

	async resetPassword(resetToken: string, password: string) {
		await firstValueFrom(
			this.http.post<void>(environment.apiUrl + '/auth/resetPassword', {
				resetToken,
				password
			 })
		)
	}

	verifyEmail(verificationToken: string) {
		return this.http.post<string | undefined>(environment.apiUrl + '/auth/verifyEmail', {
				verificationToken
			});
	}
}
