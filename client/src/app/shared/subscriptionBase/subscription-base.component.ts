import { Directive, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";


@Directive()
export abstract class SubscriptionBase implements OnDestroy {
	protected subscriptions: Subscription[] = [];

	constructor() {
		let f = this.ngOnDestroy;
	
		this.ngOnDestroy = () => {
			f();
			this.unsubscribeAll();
		};
	}
	
	protected safeSubscription (sub: Subscription): Subscription {
		this.subscriptions.push(sub);
		return sub;
	}
	
	private unsubscribeAll() {
		this.subscriptions.forEach(element => {
			element.unsubscribe();
		});
	}
	
	ngOnDestroy() { }
}


 
