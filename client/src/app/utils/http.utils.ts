import { HttpParams } from "@angular/common/http";

export function buildHttpParams(data: Object) {
	let params = new HttpParams();
		for (const [key, value] of Object.entries(data)) {
			if (typeof value === 'object')
				params = params.append(key, value.join(','))
			else
				params = params.append(key, value);
		}
	return params;
}