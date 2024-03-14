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
	isDarkMode: boolean = false;

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit() {
		var currentTheme = localStorage.getItem('theme');
		if (currentTheme)
			this.isDarkMode = currentTheme === 'dark';
	}

	toggleDarkMode() {
		var currentTheme = document.documentElement.getAttribute("color-theme");
		var targetTheme = "light";
		if (!(currentTheme === "dark"))
			targetTheme = "dark";
		document.documentElement.setAttribute('color-theme', targetTheme)
		localStorage.setItem('theme', targetTheme);
	  }

	logOut() {
		this.authService.logout();
	}

	goToHomePage() {
		this.router.navigateByUrl("/");
	}

	toggleMainMenu() {
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

	toggleNotificationsMenu() {
		const menu = document.querySelector('app-notifications-side-bar');

		if ((menu as any).style.display === 'block')
			(menu as any).style.display = 'none';
		else {
			(menu as HTMLElement).style.display = 'block';
			(menu as HTMLElement).style.zIndex = '2';
			(menu as HTMLElement).style.position = 'fixed';
			(menu as HTMLElement).style.right = '0';
			(menu as HTMLElement).style.top = '45px';
			(menu as HTMLElement).style.overflow = 'auto';
		}
	}
}
