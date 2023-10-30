import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AuthService } from 'src/app/service/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	environment	= environment;

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	logOut() {
		this.authService.logout();
	}

	goToHomePage() {
		this.router.navigateByUrl("/");
	}

	toggleMenu() {
		const menu = document.querySelector('app-nav-side-bar');

		if ((menu as any).style.display === 'block')
			(menu as any).style.display = 'none';
		else {
			(menu as HTMLElement).style.display = 'block';
			(menu as HTMLElement).style.zIndex = '2';
			(menu as HTMLElement).style.height = '100%';
			(menu as HTMLElement).style.position = 'fixed';
		}
	}
}
