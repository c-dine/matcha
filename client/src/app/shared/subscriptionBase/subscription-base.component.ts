import { Directive, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";


@Directive()
export abstract class SubscriptionBase implements OnDestroy {
	private subscriptions: Subscription[] = [];

	constructor() {}
	
	protected saveSubscription(...sub: Subscription[]): void {
		this.subscriptions.push(...sub);
	}
	
	protected unsubscribeAll() {
		this.subscriptions.forEach(element => {
			element.unsubscribe();
		});
	}
	
	ngOnDestroy() {
		this.unsubscribeAll();
	}
}


 
