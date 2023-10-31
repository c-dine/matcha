import { Component } from '@angular/core';
import { NavbarProfile } from '@shared-models/user.model';

@Component({
	selector: 'app-contacts-side-bar',
	templateUrl: './contacts-side-bar.component.html',
	styleUrls: ['./contacts-side-bar.component.css']
})
export class ContactsSideBarComponent {
	users: NavbarProfile[] = [
		{
			'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
			'firstName': "John",
			'lastName': "Doe",
			'username': "Jondo"
		},
		{
			'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
			'firstName': "John",
			'lastName': "Doe",
			'username': "Jondo"
		}, {
			'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
			'firstName': "John",
			'lastName': "Doe",
			'username': "Jondo"
		}, {
			'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
			'firstName': "John",
			'lastName': "Doe",
			'username': "Jondo"
		}, {
			'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
			'firstName': "John",
			'lastName': "Doe",
			'username': "Jondo"
		}, {
			'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
			'firstName': "John",
			'lastName': "Doe",
			'username': "Jondo"
		},
	]
}
