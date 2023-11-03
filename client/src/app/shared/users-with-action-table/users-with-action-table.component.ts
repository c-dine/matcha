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
    ) {}

    ngOnInit() {
        this.users.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

	navigateToProfile(userId: string | undefined) {
		if (!userId) return;
		this.router.navigate([`/app/profile`], { queryParams: { id: userId } });
	}

    onActionClick(userId: string | undefined) {
		if (!userId) return;
        this.action.emit(userId);
    }
}