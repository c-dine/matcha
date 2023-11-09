import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { ChatSocketService } from './socket/chatSocket.service';
import { ActivitySocketService } from './socket/activitySocket.service';
import { connectionSocketService } from './socket/connectionSocket.service';

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
		this.chatSocket.connect();
		this.activitySocket.connect();
		this.connectionSocket.connect();
		return true;
	}
}
