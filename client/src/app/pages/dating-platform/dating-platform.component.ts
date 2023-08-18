import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';
import { FirstProfileFillingDialogComponent } from './profile/first-profile-filling-dialog/first-profile-filling-dialog.component';

@Component({
  selector: 'app-dating-platform',
  templateUrl: './dating-platform.component.html',
  styleUrls: ['./dating-platform.component.css']
})
export class DatingPlatformComponent {

	constructor(
		private profileService: ProfileService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		const profile = await firstValueFrom(this.profileService.getProfile())
			.catch();
		if (!profile)
			this.dialog.open(FirstProfileFillingDialogComponent, {
				disableClose: true,
				autoFocus: false
			});
	}

}
