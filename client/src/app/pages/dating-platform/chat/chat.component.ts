import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})
export class ChatComponent {
	isMobile!: Boolean;
	isSideBarOpen!: Boolean;
	constructor() { }

	ngOnInit() {
		if (window.screen.width <= 600) {
			this.isMobile = true
			this.isSideBarOpen = false;
		} else {
			this.isMobile = false;
			this.isSideBarOpen = true;
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		const menu = document.getElementById('contact-side-bar');
		if (event.target.innerWidth <= 600) {
			this.isMobile = true
			this.isSideBarOpen = false;
			(menu as any).style.display = 'none'
		} else {
			this.isMobile = false;
			this.isSideBarOpen = true;
			(menu as any).style.display = 'block';
		}
	}

	toggleMenu() {
		const menu = document.getElementById('contact-side-bar');
		(this.isSideBarOpen)
			? (menu as any).style.display = 'none'
			: (menu as any).style.display = 'block';
		this.isSideBarOpen = !this.isSideBarOpen;
	}
}
