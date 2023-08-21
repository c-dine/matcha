import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

	token: string | undefined;

	constructor(
		private snackBar: MatSnackBar,
		private authService: AuthService
	) {
		this.authService.getAccessTokenObs().subscribe({
			next: (token) => this.token = token
		});
	}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const modifiedRequest = request.clone({
				setHeaders: {
					Authorization: `Bearer ${this.token}`,
				},
			});

		return next.handle(modifiedRequest).pipe(
			catchError((error: HttpErrorResponse) => {
				this.snackBar.open(error.error.error, 'Close', {
					duration: 4000,
					panelClass: "error-snackbar"
				});
				return throwError(() => error);
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
}
