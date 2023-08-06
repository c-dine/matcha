import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-informations',
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.css']
})
export class UserInformationsComponent implements OnInit {
	user!: UserDto;

	ngOnInit(): void {
		this.user = {
			'profilePictureSrc': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
			'firstName': "John",
			'lastName': "Doe",
			'location': "Paris",
			'likesNb': 250,
			'matchesNb': 64,
			'fameRate': 76
		}
	}
}
