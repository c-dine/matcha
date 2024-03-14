import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Matcha';

	ngOnInit() {
		var currentTheme = localStorage.getItem('theme');
		if (currentTheme)
			document.documentElement.setAttribute('color-theme', currentTheme)
	}
}
