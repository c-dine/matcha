import { Component } from "@angular/core";
import { User } from "@shared-models/user.model";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Subscription } from "rxjs";
import { UserService } from "src/app/service/user.service";
import Feature from 'ol/Feature.js';
import Layer from 'ol/';
import Point from 'ol/geom/Point.js';

@Component({
	selector: 'app-interactive-map',
	templateUrl: './interactive-map.component.html',
	styleUrls: ['./interactive-map.component.css', '../../../styles/buttons.css']
})
export class InteractiveMapComponent {

	map!: Map;
	currentUser: User | null = null;

	mySubscriptions: Subscription[] = [];

	constructor(
		private userService: UserService
	) { }

	ngOnInit() {
		this.mySubscriptions.push(
			this.userService.getCurrentUserObs().subscribe({
				next: (user) => {
					this.currentUser = user;
					this.initMap();
				}
			})
		);
		this.initMap();
	}

	ngOnDestroy() {
		this.mySubscriptions.forEach(subscription => subscription.unsubscribe());
	}

	initMap() {
		this.map = new Map({
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			target: 'map',
			view: new View({
				center: [
					this.currentUser?.userGivenLocation?.longitude || this.currentUser?.location?.longitude || 0,
					this.currentUser?.userGivenLocation?.latitude || this.currentUser?.location?.latitude || 0
				],
				projection: 'EPSG:4326',
				zoom: 15,
				minZoom: 10,
				maxZoom: 20,
			}),
		});
		this.addUsersPins();
	}

	addUsersPins() {
		this.addCurrentUserPin();
	}

	addCurrentUserPin() {
		// const layer = new Layer({
		// 	source: new Source({
		// 		features: [
		// 			new Feature({
		// 				geometry: new Point(([
		// 					this.currentUser?.userGivenLocation?.longitude || this.currentUser?.location?.longitude || 0,
		// 					this.currentUser?.userGivenLocation?.latitude || this.currentUser?.location?.latitude || 0
		// 				]))
		// 			})
		// 		]
		// 	})
		// });
	}
}