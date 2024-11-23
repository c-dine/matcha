import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse,
	HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { AuthStateService } from './auth.state';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
	constructor(
		private snackBar: MatSnackBar,
		private authService: AuthService,
		private authState: AuthStateService
	) {	}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const accessToken = this.authState.getAccessToken();

		return next.handle(accessToken ? this.addTokenToRequest(request, accessToken) : request).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401 && request.url.includes("refreshAccessToken")) {
					this.authService.logout();
					return this.displayAndThrowError(error);
				}
				if (error.status === 401 && !request.url.includes("logIn")) {
					return this.authService.refreshAccessToken().pipe(
						switchMap(() => {
							return next.handle(
								this.addTokenToRequest(request, this.authState.getAccessToken() as string)
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
					event = event.clone({ body: event.body?.data });
				}
				return event;
			})
		);
	}

	displayAndThrowError(error: HttpErrorResponse) {
		if (error.error.error?.length)
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
