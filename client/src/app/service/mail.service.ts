import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {

    constructor(
        private http: HttpClient,
    ) {}

	async sendResetPasswordMail(email: string) {
		await firstValueFrom(this.http.post<void>(environment.apiUrl + '/mail/resetPassword', { email }));
	}

}
