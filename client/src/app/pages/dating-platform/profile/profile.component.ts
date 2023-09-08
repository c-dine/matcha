import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '@shared-models/profile.model';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

	profile: UserProfile | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private profileService: ProfileService
	) { }

	ngOnInit() {
		this.route.queryParamMap.subscribe(async params => {
			if (params.has("id"))
				this.profileService.getUserProfile(params.get("id") as string).subscribe({
					next: (profile)=> this.profile = profile,
					error: () => this.router.navigate(["/app/userList"])
				});		
		})
	}
}
