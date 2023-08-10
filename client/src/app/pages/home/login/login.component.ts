import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../styles/dialog.css', '../../../styles/form.css']
})
export class LoginComponent {
    username: string = "";
    password: string = "";

    constructor(
    	private authService: AuthService,
		private router: Router,
		private matDialogRef: MatDialogRef<LoginComponent>
    ) {}

    async onSubmit() {
		if (!this.username || !this.password) return;
		const loggedUser = await this.authService.login({
			username: this.username,
			password: this.password
		})
		if (!loggedUser) return;
		this.matDialogRef.close();
        this.router.navigate(['/app']);
    }
}
  