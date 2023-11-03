import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', "../../styles/picture.css"]
})
export class HomeComponent implements OnInit, OnDestroy {

	environment = environment;

	user: User | undefined;

	mySubscription: Subscription[] = [];

	getFirebasePictureUrl = getFirebasePictureUrl;

	constructor(
		private dialog: MatDialog,
		private authService: AuthService,
		private userService: UserService,
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
			this.userService.getCurrentUserObs().subscribe({
				next: (user) => this.user = user as User | undefined
			})
		);
	}

	ngOnDestroy() {
		this.mySubscription.forEach(subscription => subscription.unsubscribe());
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

	async onLogOutClick() {
		this.authService.logout();
	}

	async onSignInClick() {
		if (await this.authService.isLoggedIn())
			this.router.navigate(['/app']);
		else
			this.dialog.open(SigninDialogComponent, {
				autoFocus: false
			});
	}

	navigateToProfile() {
		if (!this.user?.id) return;
		this.router.navigate([`/app/profile`], { queryParams: { id: this.user.id } });
	}

}
