import { Component, OnDestroy, OnInit } from '@angular/core';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { take } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { User } from '@shared-models/user.model';
import { SubscriptionBase } from 'src/app/shared/subscriptionBase/subscription-base.component';
import { MessageService } from 'src/app/service/message/message.service';
import { AnimationOptions } from 'ngx-lottie';


@Component({
	selector: 'app-conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.css'],
})
export class ConversationComponent extends SubscriptionBase implements OnInit, OnDestroy {
	conversationUser: User | null = null;
	currentUser: User | null = null;
	profilePictureUrl = '';
	options: AnimationOptions = {
		path: '/assets/chat_lottie.json'
	}

	constructor(
		public messageService: MessageService,
		private userService: UserService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		super();
	}

	ngOnInit(): void {
		this.setUpCurrentUserSubscription();
		this.setupRouteSubscription();
	}

	override ngOnDestroy(): void {
		this.messageService.clearMesages();
	}

	private setUpCurrentUserSubscription(): void {
		this.userService.getCurrentUserObs().pipe(take(1)).subscribe(
			user => this.currentUser = user
		);
	}

	private setupRouteSubscription(): void {
		this.subscribeToRouteParams();
	}

	private subscribeToRouteParams(): void {
		this.subscriptions.push(
			this.route.paramMap.subscribe((params: ParamMap) => {
				const userId = params.get('id');
				if (userId) {
					this.loadConversationUser(userId);
				}
			})
		);
	}

	private loadConversationUser(userId: string): void {
		this.userService.getUserProfile(userId).pipe(take(1)).subscribe({
			next: (user) => {
				this.conversationUser = user;
				this.messageService.conversationUserId = userId;
				this.messageService.loadMessages();
			},
			error: () => {
				this.router.navigate(['/404']);
			}
		});
	}

	getCurrentUserProfilePictureUrl(): string {
		return this.getProfilePictureUrl(this.currentUser);
	}

	getConversationUserProfilePictureUrl(): string {
		return this.getProfilePictureUrl(this.conversationUser);
	}

	private getProfilePictureUrl(user: User | null): string {
		return getFirebasePictureUrl(user?.picturesIds?.profilePicture);
	}

	hasConversationSelected(): boolean {
		return !!this.conversationUser?.id;
	}
}
