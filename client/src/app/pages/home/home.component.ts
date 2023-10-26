import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninDialogComponent } from './signin-dialog/signin-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
import { VerifyEmailDialogComponent } from './verify-email-dialog/verify-email-dialog.component';
import { environment } from '@environment/environment';
import { User } from '@shared-models/user.model';
import { Subscription } from 'rxjs';
import { Profile } from '@shared-models/profile.model';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

	environment = environment;

	user: User | undefined;
	userProfile: Profile | null = null;

	mySubscription: Subscription[] = [];

	constructor(
		private dialog: MatDialog,
		private authService: AuthService,
		private profileService: ProfileService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	async ngOnInit() {
		this.route.queryParamMap.subscribe(params => {
			if (params.has("resetToken"))
				this.openResetPasswordDialog(String(params.get("resetToken")));
			if (params.has("verificationToken"))
				this.openVerifyEmailDialog(String(params.get("verificationToken")));
		})
		if (!(await this.authService.isLoggedIn()))
			return;
		this.mySubscription.push(
			this.authService.getCurrentUserObs().subscribe({
				next: (user) => {
					console.log(user)
					this.user = user
				}
			})
		);
		this.mySubscription.push(
			this.profileService.getProfileObs().subscribe({
				next: (profile) => {
					console.log(profile)
					this.userProfile = profile
				}
			})
		);
	}

	openResetPasswordDialog(resetToken: string) {
		this.dialog.open(ResetPasswordDialogComponent, {
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
