import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { ChatSocketService } from './socket/chatSocket.service';
import { ActivitySocketService } from './socket/activitySocket.service';
import { connectionSocketService } from './socket/connectionSocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
		private chatSocket: ChatSocketService,
		private activitySocket: ActivitySocketService,
		private connectionSocket: connectionSocketService,
		private snackBar: MatSnackBar,
    ) {}

	async canActivate(): Promise<boolean> {
		if (!(await this.authService.isLoggedIn())) {
			this.router.navigate(['']);
			return false;
		}
		if (!(await this.userService.userHasProfile())) {
			this.router.navigate(['/fillProfile']);
			return true;
		}
		if (!(await this.userService.userHasValidatedProfile())) {
			this.router.navigate(['']);
			this.snackBar.open("Please validate your profile by clicking the link you received by mail.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return true;
		}
		this.chatSocket.connect();
		this.activitySocket.connect();
		this.connectionSocket.connect();
		return true;
	}
}
