import { Component } from "@angular/core";
import { GeoCoordinate, MapUser, User } from "@shared-models/user.model";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Subscription, firstValueFrom } from "rxjs";
import { UserService } from "src/app/service/user.service";
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature.js';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Overlay from 'ol/Overlay';
import { Router } from "@angular/router";
import { getFirebasePictureUrl } from "src/app/utils/picture.utils";

@Component({
	selector: 'app-interactive-map',
	templateUrl: './interactive-map.component.html',
	styleUrls: ['./interactive-map.component.css', '../../../styles/picture.css']
})
export class InteractiveMapComponent {

	map!: Map;
	currentUser: User | null = null;
	otherUsers: MapUser[] = [];

	mySubscriptions: Subscription[] = [];

	selectedFeature: any = null;

	constructor(
		private userService: UserService,
		private router: Router
	) { }

	ngOnInit() {
		this.mySubscriptions.push(
			this.userService.getCurrentUserObs().subscribe({
				next: (user) => {
					this.currentUser = user;
					if (this.map)
						this.updateMap();
					this.setView();
				}
			})
		);
		this.initMap();
	}

	setView() {
		this.map.setView(new View({
			center: [
				this.currentUser?.userGivenLocation?.longitude || this.currentUser?.location?.longitude || 0,
				this.currentUser?.userGivenLocation?.latitude || this.currentUser?.location?.latitude || 0
			],
			projection: 'EPSG:4326',
			zoom: 18,
			maxZoom: 19,
		}));
		this.listenToZoom();
	}

	async initMap() {
		this.map = new Map({
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			target: 'map'
		});
		this.setView();
		await this.getOtherUsers();
		this.addUsersPins();
		this.setPopup();
		this.listenToZoom();
	}

	setPopup() {
		const popup = document.getElementById('popup');

		if (!popup) return;
		const popupOverlay = new Overlay({
			element: popup as HTMLElement,
			autoPan: {
				animation: {
					duration: 250,
				},
			},
		});
		this.map.addOverlay(popupOverlay);

		this.map.on('click', () => {
			popupOverlay.setPosition(undefined);
			popup?.blur();
		});
		this.map.on('singleclick', (event) => {
			if (this.selectedFeature !== null)
				this.selectedFeature = null;
			this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
				this.selectedFeature = feature;
				return true;
			});

			if (!popup || !this.selectedFeature) return;
			const user = this.otherUsers.find(user => user.id === this.selectedFeature.getProperties()['name']);
			
			(document.getElementById('popup-user-details') as HTMLElement).innerHTML = `
				<span class="popup-user-name">${user?.username}</span>
				<span>${user?.fameRate}%</span>
			`;
			(document.getElementById('popup-picture') as HTMLElement).innerHTML = `
				<img src="${getFirebasePictureUrl(user?.pictureId)}" class="popup-picture" />
			`;
			popupOverlay.setPosition(event.coordinate);
		});
	}

	listenToZoom() {
		this.map.getView().on('change', () => {
			this.getOtherUsers();
			this.updateMap();
		});
	}

	async getOtherUsers() {
		const extent = this.map.getView().calculateExtent(this.map.getSize());
		this.otherUsers = await firstValueFrom(
			this.userService.getMapUsers({
				bottomLatitude: extent[1],
				topLatitude: extent[3],
				leftLongitude: extent[0],
				rightLongitude: extent[2]
			})
		);
	}

	ngOnDestroy() {
		this.mySubscriptions.forEach(subscription => subscription.unsubscribe());
	}

	updateMap() {
		this.map.getLayers().getArray()
			.filter(layer => layer.getClassName() === 'currentUserLayer' || layer.getClassName() === 'otherUsersLayer')
			.forEach(layer => this.map.removeLayer(layer));
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
			projection: 'EPSG:4326',
			name: 'currentUser'
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
				features: [pinFeature],
			}),
			className: 'currentUserLayer'
		});
		this.map.addLayer(vectorLayer);
	}

	addOtherUsersPins() {
		const featuresArray: Feature[] = [];
		this.otherUsers.map(user => {
			featuresArray.push(new Feature({
				geometry: new Point(([
					user.location.longitude,
					user.location.latitude
				])),
				projection: 'EPSG:4326',
				name: user.id
			}));
		});
		featuresArray.forEach(feature => feature.setStyle(new Style({
			image: new Icon({
				src: 'https://cdn-icons-png.flaticon.com/512/4315/4315546.png',
				scale: 0.05,
			}),
		})));
		const vectorLayer = new VectorLayer({
			source: new VectorSource({
				features: featuresArray,
			}),
			className: 'otherUsersLayer'
		});
		this.map.addLayer(vectorLayer);
	}

	navigateToProfile() {
		const user = this.otherUsers.find(user => user.id === this.selectedFeature.getProperties()['name']);
		if (!user) return;
		this.router.navigate([`/app/profile`], { queryParams: { id: user.id } });
	}
}