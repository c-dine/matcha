import { Component } from '@angular/core';

@Component({
	selector: 'app-dating-platform',
	templateUrl: './dating-platform.component.html',
	styleUrls: ['./dating-platform.component.css']
})
export class DatingPlatformComponent {

	closeMenu() {
		const menu = document.querySelector('app-nav-side-bar');
		const notificationMenu = document.querySelector('app-notifications-side-bar');
		(menu as any).style.display = 'none';
		(notificationMenu as any).style.display = 'none';
	}

}
