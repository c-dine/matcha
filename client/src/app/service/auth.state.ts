import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Cookies from 'js-cookie';

@Injectable({
	providedIn: 'root',
})
export class AuthStateService {
	private refreshCookie = 'refresh';
	private accessTokenSubject = new BehaviorSubject<string | undefined>(undefined);

	accessToken$ = this.accessTokenSubject.asObservable();

	setAccessToken(accessToken: string | undefined): void {
		this.accessTokenSubject.next(accessToken);
	}

	getAccessToken(): string | undefined {
		return this.accessTokenSubject.value;
	}

	setRefreshToken(token: string) {
		Cookies.set(this.refreshCookie, token);
	}

	getRefreshToken(): string | undefined {
		return Cookies.get(this.refreshCookie);
	}

	removeRefreshToken() {
		Cookies.remove("refreshToken");
	}
}
