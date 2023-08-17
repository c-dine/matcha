import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
	constructor(
		private snackBar: MatSnackBar,
		private authService: AuthService
	) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return this.authService.getAccessTokenObs().pipe(
		switchMap(token => {
			const modifiedRequest = request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
			});

			return next.handle(modifiedRequest).pipe(
				catchError((error: HttpErrorResponse) => {
					this.snackBar.open(error.error, 'Close', {
						duration: 5000,
						panelClass: "error-snackbar"
					});

					return throwError(() => error);
				})
			);
		})
		);
	}
}
