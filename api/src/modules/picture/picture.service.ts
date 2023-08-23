import { PoolClient } from "pg";
import { v4 } from "uuid";
import { bucket } from "../../app.js";
import { PresignedPictureUrl } from '@shared-models/picture.model.js';

export class PictureService {

	dbClient: PoolClient;
	
	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
	}

	async generateUploadUrl(): Promise<PresignedPictureUrl> {
		const fileName = v4();
		const [uploadUrl] = await bucket.file(fileName).getSignedUrl({
			version: 'v4',
			action: 'write',
			expires: Date.now() + 15 * 60 * 1000,
			contentType: `image/jpeg`
		});

		return { id: fileName, uploadUrl };
	}
}