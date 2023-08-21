import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';
import { Profile } from '@shared-models/profile.model';

@Component({
  selector: 'app-dating-platform',
  templateUrl: './dating-platform.component.html',
  styleUrls: ['./dating-platform.component.css']
})
export class DatingPlatformComponent {

	private profile: Profile | null = null;

	constructor(
		private profileService: ProfileService,
		private dialog: MatDialog
	) {}

}
