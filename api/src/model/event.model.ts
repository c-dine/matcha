import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class EventModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("event", dbClient);
	}

	async getEventsList(userId: string, timeFrame: { start: Date, end: Date }) {
		const query = this.getEventsListQuery();
		const values = [ userId, timeFrame.start, timeFrame.end ];
		const result = await this.dbClient.query(query, values);
		return result.rows;
	}

	private getEventsListQuery(): string {
		return `
			SELECT
				event.id,
				event.target_user_id,
				event.user_id,
				event.date,
				event.start_date,
				event.end_date,
				event.title,
				"user".username,
				picture.id as profile_pic_id
			FROM event
			LEFT JOIN "user" ON "user".id = (
					CASE
						WHEN event.target_user_id = $1 THEN event.user_id
						WHEN event.user_id = $1 THEN event.target_user_id
					END
				)
			LEFT JOIN picture ON picture.user_id = "user".id AND is_profile_picture = true
			WHERE (event.user_id = $1 OR event.target_user_id = $1)
				AND event.start_date > $2 AND event.end_date < $3
		`;
	}
}
