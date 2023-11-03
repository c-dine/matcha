import { Directive, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";


@Directive()
export class SubscriptionBase implements OnDestroy {
	protected subscriptions: Subscription[] = [];

	constructor() { }

	ngOnDestroy(): void {
		this.unsubscribeFromSubscriptions();
	}

	private unsubscribeFromSubscriptions(): void {
		this.subscriptions.forEach((subscription) => {
			subscription.unsubscribe();
		});
	}
}
