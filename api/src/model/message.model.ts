import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class MessageModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("messages", dbClient);
	}

	async getUserConversations(currentUserId: string) {
		const query = this.getUserConversationsQuery();
		const result = await this.dbClient.query(query, [currentUserId]);
		return result.rows;
	}

	private getUserConversationsQuery(): string {
		let query = `
			SELECT
				MAX(u.last_name) AS lastname,
				MAX(u.first_name) AS firstname,
				p.id as picture_id,
				pr.id as profile_id,
				u.id as user_id,
				MAX(m.message) AS last_message,
				MAX(m.date) AS latest_date
			FROM messages m
			LEFT JOIN "user" u ON
				CASE
					WHEN m.to_user_id = $1 THEN m.from_user_id
					WHEN m.from_user_id = $1 THEN m.to_user_id
				END = u.id
			LEFT JOIN "profile" pr ON u.id = pr.user_id
			LEFT JOIN "picture" p ON pr.id = p.profile_id AND p.is_profile_picture = true
			WHERE
				m.to_user_id = $1
			OR
				m.from_user_id = $1
			GROUP BY u.id, pr.id, picture_id;
		`;
		return query;
	}
}
