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

	async updateProfilePictures(profilePictures: ProfilePicturesIds, userId: string) {
		const actualProfilePicturesIds = await this.getProfilePictures(userId);
		const picturesIdsToDelete = [
			...profilePictures.profilePicture === actualProfilePicturesIds.profilePicture ? [] : [actualProfilePicturesIds.profilePicture],
			...actualProfilePicturesIds.additionnalPicture.filter(id => !profilePictures.additionnalPicture.includes(id))
		];
		const picturesToCreate: ProfilePicturesIds = {
			profilePicture: profilePictures.profilePicture === actualProfilePicturesIds.profilePicture ? undefined : profilePictures.profilePicture,
			additionnalPicture: profilePictures.additionnalPicture.filter(id => !actualProfilePicturesIds.additionnalPicture.includes(id))
		};

		await this.deleteProfilePictures(picturesIdsToDelete, userId);
		await this.createProfilePictures(picturesToCreate, userId);
	}

	async getProfilePictures(userId: string): Promise<ProfilePicturesIds> {
		const profilePictures = await this.pictureModel.findMany([{
			user_id: userId
		}]);

		return {
			profilePicture: profilePictures.find(picture => picture.is_profile_picture === true)?.id,
			additionnalPicture: profilePictures.filter(picture => picture.is_profile_picture === false).map(picture => picture.id)
		}
	}

	async deleteProfilePictures(picturesIdsToDelete: string[], userId: string) {
		if (!picturesIdsToDelete.length) return;
		const deletedPicturesIds = (await this.pictureModel.delete(
			picturesIdsToDelete.map(id => ({
				user_id: userId,
				id
			})), ["id"])).map(picture => picture.id);
		deletedPicturesIds.forEach(id => bucket.file(id).delete());
	}

	async createProfilePictures(profilePictures: ProfilePicturesIds, userId: string) {
		await this.pictureModel.createMany([
			...profilePictures.profilePicture ? [this.getPictureCreateQuery(profilePictures.profilePicture, userId, true)] : [],
			...profilePictures.additionnalPicture.map(pictureId => this.getPictureCreateQuery(pictureId, userId, false))
		]);
	}

	private getPictureCreateQuery(id: string, userId: string, isProfilePicture: boolean) {
		return {
			id,
			user_id: userId,
			is_profile_picture: isProfilePicture
		}
	}

	async getProfilePicIdsOfUserIds(userIds: string[]) {
		return (await this.pictureModel.findMany(userIds.map(id => ({
			user_id: id,
			is_profile_picture: true
		})))).map(picture => ({
			id: picture.id,
			userId: picture.user_id
		}));
	}

	async userHasProfilePic(userId: string): Promise<boolean> {
		const profilePic = (await this.pictureModel.findMany([{
			user_id: userId,
			is_profile_picture: true
		}]))[0];
		return !!profilePic;
	}
}