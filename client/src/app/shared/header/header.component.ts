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
}
