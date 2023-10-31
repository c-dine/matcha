import { PoolClient } from "pg";
import { ModelBase } from "./base.js";
import { GeoCoordinate, ProfileFilters, UserListFilters } from "@shared-models/user.model.js";

export class UserModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("user", dbClient);
	}

	async getUserProfile(requestedUserId: string, currentUser: user) {
		const query = this.getUserProfileQuery(requestedUserId, currentUser);
		const result = await this.dbClient.query(query);
		return result.rows[0];
	}

	private getUserProfileQuery(requestedUserId: string, currentUser: user): string {
		let query = `
			${this.getUserSelectQuery(currentUser, requestedUserId === currentUser.id)}
			WHERE user.id = '${requestedUserId}'
			GROUP BY
				"user".username,
				"user".last_name,
				"user".first_name,
				"user".id,
				currentUserLike.is_liked,
				likedCurrentUser.is_liked
			`;
		return query;
	}

	private getUserSelectQuery(
		currentUser: user,
		isCurrentUser: boolean
	): string {
		return `SELECT
					"user".id,
					"user".username,
					"user".last_name,
					"user".first_name,
					"user".gender,
					"user".birth_date,
					"user".sexual_preferences,
					"user".biography,
					"user".fame_rate,
					${isCurrentUser ? `"user".user_given_location_latitude,
					"user".user_given_location_longitude,` : ""}
					currentUserLike.is_liked,
					likedCurrentUser.is_liked as liked_current_user,
					(SELECT COUNT(*) FROM "like" AS likeCount WHERE likeCount.target_user_id = "user".id AND likeCount.is_liked = true) AS like_count,
					(SELECT COUNT(*) FROM "like" AS dislikeCount WHERE dislikeCount.target_user_id = "user".id AND dislikeCount.is_liked = false) AS dislike_count,
					(SELECT COUNT(*) FROM view AS viewCount WHERE viewCount.target_user_id = "user".id) AS view_count,
					(SELECT COUNT(*) FROM "like" AS matchCount WHERE matchCount.target_user_id = "user".id AND matchCount.is_liked = true AND matchCount.user_id IN (
						SELECT matchedUser.id
						FROM "like" AS currentUserMatches
						LEFT JOIN "user" AS matchedUser ON matchedUser.id = currentUserMatches.target_user_id
						WHERE currentUserMatches.user_id = "user".id AND currentUserMatches.is_liked = true
					)) AS match_count,
					MAX(CASE WHEN picture.is_profile_picture THEN picture.id::TEXT END) AS profile_picture_id,
					STRING_AGG(DISTINCT(CASE WHEN NOT picture.is_profile_picture THEN picture.id::text END), ',') AS additionnal_pictures_ids,
					STRING_AGG(DISTINCT(tag.label)::TEXT, ',') AS tags,
					calculate_distance(
						COALESCE("user".user_given_location_latitude, "user".location_latitude),
						COALESCE("user".user_given_location_longitude, "user".location_longitude),
						${currentUser.user_given_location_latitude === null ? currentUser.location_latitude : currentUser.user_given_location_latitude},
						${currentUser.user_given_location_longitude === null ? currentUser.location_longitude : currentUser.user_given_location_longitude},
						'K') as distance_km
				FROM "user"
				LEFT JOIN tag ON tag.id IN (
					SELECT tag_id FROM profile_tag_asso WHERE user_id = "user".id
				)
				LEFT JOIN picture ON picture.user_id = "user".id
				LEFT JOIN "like" AS currentUserLike ON currentUserLike.target_user_id = "user".id AND currentUserLike.user_id = '${currentUser.id}'
				LEFT JOIN "like" AS likedCurrentUser ON likedCurrentUser.target_user_id = '${currentUser.id}' AND likedCurrentUser.user_id = "user".id
			`;
	}

	async getUserList(filters: ProfileFilters, currentUser: user) {
		const query = this.getUserListQuery(filters, currentUser);
		const values = this.getUserListQueryValues(filters);
		const result = await this.dbClient.query(query, values);
		return result.rows;
	}

	private getUserListQuery(filters: ProfileFilters, currentUser: user): string {
		let i = 1;
		let query = `
			WITH profile_with_distance AS (
				${this.getUserSelectQuery(currentUser, false)}
				WHERE "user".id != '${currentUser.id}'`;

		if (filters.ageMin)
			query += ` AND "user".birth_date <= $${i++}`;
		if (filters.ageMax)
			query += ` AND "user".birth_date > $${i++}`;
		if (filters.fameRateMin)
			query += ` AND "user".fame_rate >= $${i++}`;
		if (filters.fameRateMax)
			query += ` AND "user".fame_rate <= $${i++}`;
		if (filters.tags) {
			query += ` AND "user".id IN (
						SELECT user_id FROM profile_tag_asso WHERE tag_id IN (
							SELECT id FROM tag WHERE LOWER(label) = ANY($${i++})
						) GROUP BY user_id HAVING COUNT(DISTINCT tag_id) = ${filters.tags.length}
					)`
		}
		query += ` AND user.id NOT IN (
			SELECT target_user_id FROM blacklist WHERE blacklist.user_id = '${currentUser.id}'
			)`;
		query += ` AND "user".id NOT IN (
			SELECT user_id FROM blacklist WHERE blacklist.target_user_id = '${currentUser.id}'
			)`;
		query += this.getSexualProfileFiltersQuery(currentUser);
		query += `
			GROUP BY
				"user".id,
				"user".username,
				"user".last_name,
				"user".first_name,
				currentUserLike.is_liked,
				likedCurrentUser.is_liked
		)
		SELECT *, COUNT(*) OVER () AS total_user_count
		FROM profile_with_distance`
		if (filters.distanceKilometers)
			query += ` WHERE distance_km <= $${i++}`;
		query += this.getOrderByQuery(filters);
		query += ` LIMIT $${i++} OFFSET $${i++}`;

		return query;
	}

	private getSexualProfileFiltersQuery(currentUser: user): string {
		let query = " AND ";
		const userSexualPreference = currentUser.gender === 'undefined' ? ''
			: `("user".sexual_preferences = '${currentUser.gender}' OR user.sexual_preferences='undefined')`;

		switch (currentUser.sexual_preferences) {
			case 'female':
				query += `("user".gender != 'male' ${userSexualPreference.length ? ' AND' + userSexualPreference : ''})`
				break;
			case 'male':
				query += `("user".gender != 'female' ${userSexualPreference.length ? ' AND' + userSexualPreference : ''})`
				break;
			default:
				if (currentUser.gender === 'undefined') return " ";
				query += userSexualPreference;
				break;
		}
		return query;
	}

	private getOrderByQuery(filters: ProfileFilters) {
		switch (filters.orderBy) {
			case UserListFilters.age:
				return ` ORDER BY birth_date ${filters.order === 'asc' ? 'DESC' : ''}`;
			case UserListFilters.fame:
				return ` ORDER BY fame_rate ${filters.order === 'asc' ? '' : 'DESC'}`;
			case UserListFilters.distance:
				return ` ORDER BY distance_km ${filters.order === 'asc' ? '' : 'DESC'}`;
			default:
				return "";
		}
	}

	private getUserListQueryValues(filters: ProfileFilters) {
		const values = [];
		const todaysDate = new Date();

		if (filters.ageMin) {
			const birthDateMin = new Date();
			birthDateMin.setFullYear(todaysDate.getFullYear() - filters.ageMin);
			values.push(birthDateMin);
		}
		if (filters.ageMax) {
			const birthDateMax = new Date();
			birthDateMax.setFullYear(todaysDate.getFullYear() - filters.ageMax - 1);
			values.push(birthDateMax);
		}
		if (filters.fameRateMin)
			values.push(filters.fameRateMin);
		if (filters.fameRateMax)
			values.push(filters.fameRateMax);
		if (filters.tags?.length)
			values.push(filters.tags.map(tag => tag.toLowerCase()));
		if (filters.distanceKilometers)
			values.push(filters.distanceKilometers);
		values.push(filters.batchSize);
		values.push(filters.offset);

		return values;
	}

	async getMatchingProfiles(currentUser: user, filters: ProfileFilters) {
		const query = this.getMatchingProfileQuery(currentUser);
		const filterValues = this.getUserListQueryValues(filters);
		const result = await this.dbClient.query(query, filterValues);
		return result.rows;
	}

	private getMatchingProfileQuery(currentUser: user): string {
		let paramNb = 1
		let query = `
			${this.getMatchingProfileSelectQuery({
					latitude: currentUser.user_given_location_latitude === null ? currentUser.location_latitude : currentUser.user_given_location_latitude,
					longitude: currentUser.user_given_location_longitude === null ? currentUser.location_longitude : currentUser.user_given_location_longitude
				},
				currentUser
		)}
			WHERE user.id != '${currentUser.id}'
			AND user.gender = '${currentUser.sexual_preferences}'
			AND user.sexual_preferences = '${currentUser.gender}'
			GROUP BY
				"user".username,
				"user".last_name,
				"user".first_name
			ORDER BY
				matching_rate DESC
			LIMIT $${paramNb++} OFFSET $${paramNb++};`;
		return query;
	}

	private getMatchingProfileSelectQuery(userLocation: GeoCoordinate, currentUser: user): string {
		let commonTagscount = `(
			SELECT COUNT(*) FROM (
				SELECT matching_user_tag.label
				FROM profile_tag_asso
				JOIN tag AS matching_user_tag ON matching_user_tag.id = tag_id
				WHERE user_id = user.id
				INTERSECT
				SELECT current_user_tag.label
				FROM profile_tag_asso
				JOIN tag AS current_user_tag ON current_user_tag.id = tag_id
				WHERE user_id = '${currentUser.id}'
			) AS common_tags
		)`;
		let distance = `calculate_distance(
			COALESCE("user".user_given_location_latitude, user.location_latitude),
			COALESCE("user".user_given_location_longitude, user.location_longitude),
			${userLocation.latitude},
			${userLocation.longitude},
			'K')`
		let fameRateDelta = `ABS("user".fame_rate - ${currentUser.fame_rate})`
		let matchingFormula = `${commonTagscount} + 1 / (${distance} + ${fameRateDelta} + 1)`

		return `SELECT
			"user".username,
			"user".last_name,
			"user".first_name,
			"user".id,
			"user".gender,
			"user".birth_date,
			"user".sexual_preferences,
			"user".biography,
			"user".fame_rate,
			MAX(CASE WHEN picture.is_profile_picture THEN picture.id::TEXT END) AS profile_picture_id,
			STRING_AGG(DISTINCT(CASE WHEN NOT picture.is_profile_picture THEN picture.id::text END), ',') AS additionnal_pictures_ids,
			STRING_AGG(DISTINCT(tag.label)::TEXT, ',') AS tags,
			${distance} as distance_km,
			${matchingFormula} AS matching_rate
		FROM "user"
		LEFT JOIN tag ON tag.id IN (
			SELECT tag_id FROM profile_tag_asso WHERE user_id = user.id
		)
		LEFT JOIN picture ON picture.user_id = user.id`
	}
}
