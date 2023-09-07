import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninDialogComponent } from './signin-dialog/signin-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyEmailDialogComponent } from './verify-email-dialog/verify-email-dialog.component';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

	environment = environment;

	constructor(
		private dialog: MatDialog,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.route.queryParamMap.subscribe(params => {
			if (params.has("resetToken"))
				this.openResetPasswordDialog(String(params.get("resetToken")));
			if (params.has("verificationToken"))
				this.openVerifyEmailDialog(String(params.get("verificationToken")));
		})
	}

	openResetPasswordDialog(resetToken: string) {
		this.dialog.open(ResetPasswordComponent, {
			autoFocus: false,
			data: { resetToken }
		});
	}
	
	openVerifyEmailDialog(verificationToken: string) {
		this.dialog.open(VerifyEmailDialogComponent, {
			autoFocus: false,
			data: { verificationToken }
		});
	}

	async onLogInClick() {
		if (await this.authService.isLoggedIn())
			this.router.navigate(['/app']);
		else
			this.dialog.open(LoginDialogComponent, {
				autoFocus: false
			});
	}

	async onSignInClick() {
		if (await this.authService.isLoggedIn())
			this.router.navigate(['/app']);
		else
			this.dialog.open(SigninDialogComponent, {
				autoFocus: false
			});
	}

}
