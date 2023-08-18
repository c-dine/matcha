import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {

    constructor(
        private http: HttpClient,
    ) {}

	sendResetPasswordMail(email: string) {
		return this.http.post<void>(environment.apiUrl + '/mail/resetPassword', { email });
	}

}
