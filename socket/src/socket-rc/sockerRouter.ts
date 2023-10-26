import { SocketNamespace } from "./socketNamespace";

export interface SocketRoutes {
	route: string,
	socketNamespace: SocketNamespace
};

export class SocketRouter {
	private routes: Map<string, SocketNamespace>;

	constructor(routes?: [string, SocketNamespace][]) {
		this.routes = routes ? new Map(routes) : new Map();
	}

	setRoute(path: string, socketNamespace: SocketNamespace) {
		this.routes.set(path, socketNamespace);
	}

	forEach(
		callBackFn: (value: SocketNamespace, key: string, map: Map<string, SocketNamespace>)
			=> void,
		thisArg?: any): void {
		this.routes.forEach(callBackFn, thisArg);
	}
}