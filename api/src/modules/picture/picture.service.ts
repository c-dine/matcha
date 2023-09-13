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

	async updateProfilePictures(profilePictures: ProfilePicturesIds, profileId: string) {
		const actualProfilePicturesIds = await this.getProfilePictures(profileId);
		const picturesIdsToDelete = [
			...profilePictures.profilePicture === actualProfilePicturesIds.profilePicture ? [] : [actualProfilePicturesIds.profilePicture],
			...actualProfilePicturesIds.additionnalPicture.filter(id => !profilePictures.additionnalPicture.includes(id))
		];
		const picturesToCreate: ProfilePicturesIds = {
			profilePicture: profilePictures.profilePicture === actualProfilePicturesIds.profilePicture ? undefined : profilePictures.profilePicture,
			additionnalPicture: profilePictures.additionnalPicture.filter(id => !actualProfilePicturesIds.additionnalPicture.includes(id))
		};

		await this.deleteProfilePictures(picturesIdsToDelete, profileId);
		await this.createProfilePictures(picturesToCreate, profileId);
	}

	async getProfilePictures(profileId: string): Promise<ProfilePicturesIds> {
		const profilePictures = await this.pictureModel.findMany([{
			profile_id: profileId
		}]);

		return {
			profilePicture: profilePictures.find(picture => picture.is_profile_picture === true)?.id,
			additionnalPicture: profilePictures.filter(picture => picture.is_profile_picture === false).map(picture => picture.id)
		}
	}

	async deleteProfilePictures(picturesIdsToDelete: string[], profileId: string) {
		const deletedPicturesIds = (await this.pictureModel.delete(
			picturesIdsToDelete.map(id => ({
				profile_id: profileId,
				id
			})), ["id"])).map(picture => picture.id);
		try {
			deletedPicturesIds.forEach(id => bucket.file(id).delete());
		} catch (e: any) {
			console.log("Error while deleting pictures from firebase.")
		}
	}

	async createProfilePictures(profilePictures: ProfilePicturesIds, profileId: string) {
		await this.pictureModel.createMany([
			...profilePictures.profilePicture ? [this.getPictureCreateQuery(profilePictures.profilePicture, profileId, true)] : [],
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