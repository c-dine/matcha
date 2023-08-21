import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { FirstProfileFillingDialogComponent } from '../pages/dating-platform/profile/first-profile-filling-dialog/first-profile-filling-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private profileService: ProfileService,
		private dialog: MatDialog,
        private router: Router
    ) {}

    async canActivate(): Promise<boolean> {
        if (!(await this.authService.isLoggedIn())) {
			this.router.navigate(['']);
			return false;
		}
		if (!(await this.profileService.userHasProfile()))
			this.dialog.open(FirstProfileFillingDialogComponent, {
				disableClose: true,
				autoFocus: false
			});
		return true;
    }
}
