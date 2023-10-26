import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { ChatSocketService } from './socket/chatSocket.service';
import { ActivitySocketService } from './socket/activitySocket.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private profileService: ProfileService,
        private router: Router,
		private chatSocket: ChatSocketService,
		private activitySocket: ActivitySocketService,
    ) {}

	async canActivate(): Promise<boolean> {
		if (!(await this.authService.isLoggedIn())) {
			this.router.navigate(['']);
			return false;
		}
		if (!(await this.profileService.userHasProfile())) {
			this.router.navigate(['/fillProfile']);
			return true;
		}
		this.chatSocket.connect();
		this.activitySocket.connect();
		return true;
	}
}
