import { PoolClient } from "pg";
import { TagModel } from "../../model/tag.model.js";
import { Tag } from "@shared-models/common.models.js";
import { UserTagAssoModel } from "../../model/userTagAsso.model.js";

export class TagService {

	dbClient: PoolClient;
	tagModel: TagModel;
	userTagAssoModel: UserTagAssoModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.tagModel = new TagModel(this.dbClient);
		this.userTagAssoModel = new UserTagAssoModel(this.dbClient);
	}

	async updateUserTags(userId: string, tags: string[]) {
		await this.unlinkTagsFromUser(userId);
		await this.linkTagsToUser(userId, tags);
	}

	async linkTagsToUser(userId: string, tags: string[]) {
		const upsertedTags = await this.upsertTags(tags);

		await this.userTagAssoModel.createMany(upsertedTags.map(tag => ({
			user_id: userId,
			tag_id: tag.id
		})));
	}

	private async unlinkTagsFromUser(userId: string) {
		await this.userTagAssoModel.delete([{
			user_id: userId
		}]);
	}

	async upsertTags(labels: string[]): Promise<Tag[]> {
		const allTags = await this.getTags();
		const existingTags = allTags.filter(tag => labels.find(userLabel => userLabel.toLowerCase() === tag.label.toLowerCase()));
		const tagsToCreate = labels.filter((tag) => !existingTags.find(
			existingTag => existingTag.label.toLowerCase() === tag.toLowerCase()));

		return [...await this.createTags(tagsToCreate), ...existingTags];
	}

	async getTags(): Promise<Tag[]> {
		const tagList = await this.tagModel.findMany([{}], ["id", "label"]);
		return tagList.map(this.formatTag);
	}

	async getUserTags(userId: string): Promise<string[]> {
		const tagIds = (await this.userTagAssoModel.findMany([{
			user_id: userId
		}], ["tag_id"])).map(userTagAsso => userTagAsso.tag_id);

		return (await this.tagModel.findMany(tagIds.map(id => ({
			id
		})), ["label"])).map(tag => tag.label);
	}

	async createTags(labels: string[]): Promise<Tag[]> {
		const newTags = labels.map(label => ({ label: label }));
		return this.tagModel.createMany(newTags, ["id", "label"]);
	}

	private formatTag(tag: tag): Tag {
		return {
			id: tag?.id,
			label: tag?.label
		};
	}
}
