import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse,
	HttpResponse,
} from '@angular/common/http';
import { Observable, Subscription, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

	isRefreshingToken = false;

	constructor(
		private snackBar: MatSnackBar,
		private authService: AuthService
	) {	}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const accessToken = this.authService.getAccessToken();

		return next.handle(accessToken ? this.addTokenToRequest(request, accessToken) : request).pipe(
			catchError((error: HttpErrorResponse) => {
				if (this.isRefreshingToken && error.status === 401) {
					this.isRefreshingToken = false;
					this.authService.logout();
					return this.displayAndThrowError(error);
				}
				if (error.status === 401 && !request.url.includes("logIn")) {
					this.isRefreshingToken = true;
					console.log("Refreshing access token...");
					return this.authService.refreshAccessToken().pipe(
						switchMap(() => {
							console.log("Token got refreshed.");
							this.isRefreshingToken = false;
							return next.handle(
								this.addTokenToRequest(request, this.authService.getAccessToken() as string)
							);
						})
					);
				}
				return this.displayAndThrowError(error);
			}),
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					if (event.body?.message)
						this.snackBar.open(event.body.message, 'Close', {
							duration: 4000,
							panelClass: 'success-snackbar'
						});
					event = event.clone({ body: event.body.data });
				}
				return event;
			})
		);
	}

	displayAndThrowError(error: HttpErrorResponse) {
		this.snackBar.open(error.error.error, 'Close', {
			duration: 4000,
			panelClass: "error-snackbar"
		});
		return throwError(() => error);
	}

	addTokenToRequest(request: HttpRequest<any>, token: string) {
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
}
