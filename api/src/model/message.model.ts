import { PoolClient } from "pg";
import { ModelBase } from "./base.js";
import { Conversation } from "@shared-models/chat.models.js";

export class MessageModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("messages", dbClient);
	}

	async getUserConversations(currentUserId: string): Promise<{ data: Conversation[] }> {
		const query = this.getUserConversationsQuery();
		const result = await this.dbClient.query(query, [currentUserId]);
		return (result.rows[0]) ? (result.rows[0]) : { data: [] };
	}

	private getUserConversationsQuery(): string {
		let query = `
		WITH RankedMessages AS (
			SELECT
			  u.*,
			  m.id AS m_id,
			  p.id as p_id,
			  m.from_user_id AS m_from_user_id,
			  m.to_user_id AS m_to_user_id,
			  m.message AS m_message,
			  m.is_viewed AS m_is_viewed,
			  m.date::timestamp AS m_date,
			  ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY m.date DESC) AS rn
			FROM
			  messages m
			  LEFT JOIN "user" u ON
				CASE
				  WHEN m.to_user_id = $1 THEN m.from_user_id
				  WHEN m.from_user_id = $1 THEN m.to_user_id
				END = u.id
			  LEFT JOIN "picture" p ON u.id = p.user_id AND p.is_profile_picture = true
			WHERE
			  m.to_user_id = $1
			  OR
			  m.from_user_id = $1
		  )
		  SELECT
			json_agg(
			  json_build_object(
				'author', json_build_object(
				  'id', rankedMessages.id,
				  'gender', rankedMessages.gender,
				  'username', rankedMessages.username,
				  'lastName', rankedMessages.last_name,
				  'firstName', rankedMessages.first_name,
				  'biography', rankedMessages.biography,
				  'location', json_build_object(
					'latitude', rankedMessages.location_latitude,
					'longitude', rankedMessages.location_longitude
				  ),
				  'userGivenLocation', json_build_object(
					'latitude', rankedMessages.user_given_location_latitude,
					'longitude', rankedMessages.user_given_location_longitude
				  ),
				  'distanceKm', calculate_distance(rankedMessages.location_latitude, rankedMessages.location_longitude, rankedMessages.user_given_location_latitude, rankedMessages.user_given_location_longitude, 'K'),
				  'tags', (SELECT array_agg(tag.label) FROM user_tag_asso JOIN tag ON user_tag_asso.tag_id = tag.id WHERE user_tag_asso.user_id = rankedMessages.id),
				  'picturesIds', json_build_object(
					'profilePicture', rankedMessages.p_id,
					'additionnalPicture', (SELECT array_agg(id) FROM picture WHERE picture.user_id = rankedMessages.id)
				  ),
				  'stats', (SELECT json_build_object('isLiked', false, 'likedCurrentUser', false)),
				  'userId', rankedMessages.id
				),
				'notification', json_build_object(
				  'id', rankedMessages.m_id,
				  'from_user_id', rankedMessages.m_from_user_id,
				  'to_user_id', rankedMessages.m_to_user_id,
				  'message', rankedMessages.m_message,
				  'isViewed', rankedMessages.m_is_viewed,
				  'date', rankedMessages.m_date::timestamp
				)
			  )
			) as data
		  FROM (
			SELECT *
			FROM RankedMessages
			WHERE rn = 1
		  ) as RankedMessages;
		`;
		return query;
	}
}
