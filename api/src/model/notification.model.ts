import { PoolClient } from "pg";
import { ModelBase } from "./base.js";

export class NotificationModel extends ModelBase {
	constructor(dbClient: PoolClient) {
		super("notification", dbClient);
	}

	async getNotifications(currentUserId: string) {
		const query = this.getNotificationsQuery(currentUserId);
		const result = await this.dbClient.query(query/* , [currentUserId] */);
		return result.rows[0];
	}

	private getNotificationsQuery(id: string): string {
		let query = `
			${this.getNotificationsSelectQuery()}
			WHERE notif.to_user_id = '${id}'
			GROUP BY u.id;`;
		return query;
	}
	private getNotificationsSelectQuery(): string {
		return `
		SELECT
			json_agg(
			json_build_object(
				'author', json_build_object(
				'id', u.id,
				'gender', u.gender,
				'username', u.username,
				'lastName', u.last_name,
				'firstName', u.first_name,
				'biography', u.biography,
				'location', json_build_object(
					'latitude', u.location_latitude,
					'longitude', u.location_longitude
				),
				'userGivenLocation', json_build_object(
					'latitude', u.user_given_location_latitude,
					'longitude', u.user_given_location_longitude
				),
				'distanceKm', calculate_distance(u.location_latitude, u.location_longitude, u.user_given_location_latitude, u.user_given_location_longitude, 'K'),
				'tags', (SELECT array_agg(tag.label) FROM user_tag_asso JOIN tag ON user_tag_asso.tag_id = tag.id WHERE user_tag_asso.user_id = u.id),
				'picturesIds', json_build_object(
					'profilePicture', p.id,
					'additionnalPicture', (SELECT array_agg(id) FROM picture WHERE picture.user_id = u.id)
				),
				'stats', (SELECT json_build_object('isLiked', false, 'likedCurrentUser', false)),
				'userId', u.id
				),
				'notification', json_build_object(
					'id', notif.id,
					'from_user_id', notif.from_user_id,
					'to_user_id', notif.to_user_id,
					'message', notif.type,
					'isViewed', notif.is_viewed,
					'date', notif.date::timestamp
				)
				)
			) as data
		FROM "notification" as notif
		LEFT JOIN "user" as u ON notif.from_user_id = u.id
		LEFT JOIN "picture" as p ON p.user_id = u.id
		`;
	}
}
