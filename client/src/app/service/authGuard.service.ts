import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    async canActivate(): Promise<boolean> {
        if (await this.authService.isLoggedIn())
            return true;
        this.router.navigate(['']);
        return false;
    }
}
