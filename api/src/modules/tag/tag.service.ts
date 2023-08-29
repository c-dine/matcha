import { PoolClient } from "pg";
import { TagModel } from "../../model/tag.model.js";
import { Tag } from "@shared-models/common.models.js";
import { ProfileTagAssoModel } from "../../model/profileTagAsso.model.js";

export class TagService {

	dbClient: PoolClient;
	tagModel: TagModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.tagModel = new TagModel(this.dbClient);
	}

	async linkTagsToProfile(profileId: string, tags: string[]) {
		const upsertedTags = await this.upsertTags(tags);
		const profileTagAssoModel = new ProfileTagAssoModel(this.dbClient);

		await profileTagAssoModel.createMany(upsertedTags.map(tag => ({
			profile_id: profileId,
			tag_id: tag.id
		})));
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

	async getProfileTags(profileId: string): Promise<string[]> {
		const profileTagAssoModel = new ProfileTagAssoModel(this.dbClient);
		const tagIds = (await profileTagAssoModel.findMany([{
			profile_id: profileId
		}], ["tag_id"])).map(profileTagAsso => profileTagAsso.tag_id);

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
