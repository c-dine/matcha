import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninDialogComponent } from './signin-dialog/signin-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

	constructor(
		private dialog: MatDialog,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		const params = this.route.queryParamMap.subscribe(params => {
			if (params.has("resetToken"))
				this.openResetPasswordDialog(String(params.get("resetToken")));
		})
	}

	openResetPasswordDialog(resetToken: string) {
		this.dialog.open(ResetPasswordComponent, {
			autoFocus: false,
			data: { resetToken }
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

	onSignInClick() {
		this.dialog.open(SigninDialogComponent, {
		autoFocus: false
		});
	}

}
