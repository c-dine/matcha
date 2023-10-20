import { formatDate } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Interaction } from "@shared-models/interactions.model";
import { getFirebasePictureUrl } from "src/app/utils/picture.utils";

@Component({
    selector: 'app-users-with-action-table',
    templateUrl: './users-with-action-table.component.html',
    styleUrls: ['./users-with-action-table.component.css', '../../styles/buttons.css', '../../styles/picture.css']
})
export class UsersWithActionTableComponent {

    @Output() action = new EventEmitter<string>();
    @Input() actionLabel!: string;
    @Input() users!: Interaction[];

    formatDate = formatDate;
    getFirebasePictureUrl = getFirebasePictureUrl;
    
    constructor(
        private router: Router
    ) {    }

	navigateToProfile(profileId: string | undefined) {
		if (!profileId) return;
		this.router.navigate([`/app/profile`], { queryParams: { id: profileId } });
	}

    onActionClick(profileId: string | undefined) {
		if (!profileId) return;
        this.action.emit(profileId);
    }
}