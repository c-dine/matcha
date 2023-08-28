import { PoolClient } from "pg";
import { v4 } from "uuid";
import { bucket } from "../../app.js";
import { PresignedPictureUrl, ProfilePicturesIds } from '@shared-models/picture.model.js';
import { PictureModel } from "../../model/picture.model.js";

export class PictureService {

	dbClient: PoolClient;
	pictureModel: PictureModel;
	
	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.pictureModel = new PictureModel(dbClient);
	}

	async generateMultipleUploadUrls(count: number): Promise<PresignedPictureUrl[]> {
		const presignedPictures = [];

		for (let i = 0; i < count; i++)
			presignedPictures.push(await this.generateUploadUrl());
		return presignedPictures;
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

	async createProfilePictures(profilePictures: ProfilePicturesIds, profileId: string) {
		await this.pictureModel.createMany([
			this.getPictureCreateQuery(profilePictures.profilePicture, profileId, true),
			...profilePictures.additionnalPicture.map(pictureId => this.getPictureCreateQuery(pictureId, profileId, false))
		]);
	}

	private getPictureCreateQuery(id: string, profileId: string, isProfilePicture: boolean) {
		return {
			id,
			profile_id: profileId,
			is_profile_picture: isProfilePicture
		}
	}
}