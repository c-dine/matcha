import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, firstValueFrom, of } from 'rxjs';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AuthenticatedUser, User, NewUser } from '@shared-models/user.model'
import { environment } from '@environment/environment';
import Cookies from 'js-cookie';
import { catchError, map } from 'rxjs/operators';
import { error } from '@ant-design/icons-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private currentUserSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
	private accessTokenSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

	getAccessTokenObs() {
		return this.accessTokenSubject.asObservable();
	}
	
	getCurrentUserObs() {
		return this.currentUserSubject.asObservable();
	}

	signIn(newUser: NewUser): Observable<AuthenticatedUser>  {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/signIn', newUser)
			.pipe(
				map(user => {
					this.setSession(user);
					return user;
				})
			);
	}

    login(userAuthData: { username: string, password: string }): Observable<AuthenticatedUser> {
		return this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/logIn', userAuthData)
			.pipe(
				map(user => {
					this.setSession(user as AuthenticatedUser);
					return user;
				})
			);
    }

	setSession(user: AuthenticatedUser) {
		this.setRefreshToken(user.token.refresh || "");
		this.accessTokenSubject.next(user.token.access);
		this.currentUserSubject.next(user as User);
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
        const authenticatedUser = await firstValueFrom(
			this.http.post<AuthenticatedUser>(environment.apiUrl + '/auth/refreshAccessToken', { refreshToken })
		);
		if (!authenticatedUser)
			throw new Error("Invalid refresh token.")
		this.accessTokenSubject.next(authenticatedUser.token.access);
		this.currentUserSubject.next(authenticatedUser as User);
	}

	resetPassword(resetToken: string, password: string) {
		return this.http.post<string>(environment.apiUrl + '/auth/resetPassword', {
			resetToken,
			password
		});
	}

	verifyEmail(verificationToken: string) {
		return this.http.post<string>(environment.apiUrl + '/auth/verifyEmail', {
			verificationToken
		});
	}
}
