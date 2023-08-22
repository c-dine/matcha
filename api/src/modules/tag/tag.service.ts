import { PoolClient } from "pg";
import { TagModel } from "../../model/tag.model.js";
import { Tag } from "@shared-models/common.models.js";

export class TagService {

	dbClient: PoolClient;
	tagModel: TagModel;

	constructor(dbClient: PoolClient) {
		this.dbClient = dbClient;
		this.tagModel = new TagModel(this.dbClient);
	}

	async upsertTags(labels: string[]): Promise<Tag[]> {
		const existingTags = (await this.getTags()).map(tag => tag.label.toLowerCase());
		const tagsToCreate = labels.filter((tag) => !existingTags.includes(tag.toLowerCase()));
		return this.createTags(tagsToCreate);
	}

	async getTags(): Promise<Tag[]> {
		const tagList = await this.tagModel.findMany({}, ["label"]);
		return tagList.map(this.formatTag);
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
