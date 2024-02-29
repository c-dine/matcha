import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
	selector: 'app-404',
	templateUrl: './404.component.html',
	styleUrls: ['./404.component.css']
})
export class PageNotFoundComponent {
	options: AnimationOptions = {
		path: 'https://lottie.host/66b993c5-f9a6-4c34-a980-ca1f46e70ec0/sYRftqmc3B.json'
	}
}
