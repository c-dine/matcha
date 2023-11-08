import { Component } from "@angular/core";
import { MapUser, User } from "@shared-models/user.model";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Subscription } from "rxjs";
import { UserService } from "src/app/service/user.service";
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature.js';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';

@Component({
	selector: 'app-interactive-map',
	templateUrl: './interactive-map.component.html',
	styleUrls: ['./interactive-map.component.css', '../../../styles/buttons.css']
})
export class InteractiveMapComponent {

	map!: Map;
	currentUser: User | null = null;
	otherUsers: MapUser[] = [];

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
		this.mySubscriptions.push(
			this.userService.
		)
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
				zoom: 18,
				minZoom: 10,
				maxZoom: 19,
			}),
		});
		this.addUsersPins();
	}

	addUsersPins() {
		this.addCurrentUserPin();
		this.addOtherUsersPins();
	}

	addCurrentUserPin() {
		const pinFeature = new Feature({
			geometry: new Point(([
				this.currentUser?.userGivenLocation?.longitude || this.currentUser?.location?.longitude || 0,
				this.currentUser?.userGivenLocation?.latitude || this.currentUser?.location?.latitude || 0
			])),
			projection: 'EPSG:4326'
		});
		pinFeature.setStyle(
			new Style({
				image: new Icon({
					src: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
					scale: 0.1,
				}),
			})
		);
		const vectorLayer = new VectorLayer({
			source: new VectorSource({
				features: [ pinFeature ],
			}),
		});
		this.map.addLayer(vectorLayer);
	}

	addOtherUsersPins() {

	}
}