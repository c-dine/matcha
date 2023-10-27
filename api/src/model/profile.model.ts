import { PoolClient } from "pg";
import { ModelBase } from "./base.js";
import { GeoCoordinate, Profile, ProfileFilters, UserListFilters } from "@shared-models/profile.model.js";

export class ProfileModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("profile", dbClient);
	}

	async getUserProfile(requestedUserId: string, currentUserProfile: profile) {
		const query = this.getUserProfileQuery(requestedUserId, currentUserProfile);
		const result = await this.dbClient.query(query);
		return result.rows[0];
	}

	private getUserProfileQuery(requestedUserProfileId: string, currentUserProfile: profile): string {
		let query = `
			${this.getUserProfileSelectQuery({
			latitude: currentUserProfile.location_latitude,
			longitude: currentUserProfile.location_longitude
		}, currentUserProfile, requestedUserProfileId === currentUserProfile.id)}
			WHERE profile.id = '${requestedUserProfileId}'
			GROUP BY
				profile.id,
				"user".username,
				"user".last_name,
				"user".first_name,
				"user".id,
				currentUserLike.is_liked,
				likedCurrentUser.is_liked 
			`;
		return query;
	}

	private getUserProfileSelectQuery(
		userLocation: GeoCoordinate,
		currentUserProfile: profile,
		isCurrentUser: boolean
	): string {
		return `SELECT 
					"user".username,
					"user".last_name,
					"user".first_name,
					profile.id,
					profile.gender,
					profile.birth_date,
					profile.sexual_preferences,
					profile.biography,
					profile.fame_rate,
					${isCurrentUser ? `profile.user_given_location_latitude,
					profile.user_given_location_longitude,` : ""}
					currentUserLike.is_liked,
					likedCurrentUser.is_liked as liked_current_user,
					(SELECT COUNT(*) FROM "like" AS likeCount WHERE likeCount.target_profile_id = profile.id AND likeCount.is_liked = true) AS like_count,
					(SELECT COUNT(*) FROM "like" AS dislikeCount WHERE dislikeCount.target_profile_id = profile.id AND dislikeCount.is_liked = false) AS dislike_count,
					(SELECT COUNT(*) FROM view AS viewCount WHERE viewCount.target_profile_id = profile.id) AS view_count,
					(SELECT COUNT(*) FROM "like" AS matchCount WHERE matchCount.target_profile_id = profile.id AND matchCount.is_liked = true AND matchCount.user_id IN (
						SELECT matchedUser.id 
						FROM "like" AS currentUserMatches
						LEFT JOIN profile AS matchedProfile ON currentUserMatches.target_profile_id = matchedProfile.id
						LEFT JOIN "user" AS matchedUser ON matchedUser.id = matchedProfile.user_id
						WHERE currentUserMatches.user_id = "user".id AND currentUserMatches.is_liked = true
					)) AS match_count,
					MAX(CASE WHEN picture.is_profile_picture THEN picture.id::TEXT END) AS profile_picture_id,
					STRING_AGG(DISTINCT(CASE WHEN NOT picture.is_profile_picture THEN picture.id::text END), ',') AS additionnal_pictures_ids,
					STRING_AGG(DISTINCT(tag.label)::TEXT, ',') AS tags,
					calculate_distance(profile.location_latitude, profile.location_longitude, ${userLocation.latitude}, ${userLocation.longitude}, 'K') as distance_km
				FROM profile 
				INNER JOIN "user" ON "user".id = profile.user_id
				LEFT JOIN tag ON tag.id IN (
					SELECT tag_id FROM profile_tag_asso WHERE profile_id = profile.id
				)
				LEFT JOIN picture ON picture.profile_id = profile.id
				LEFT JOIN "like" AS currentUserLike ON currentUserLike.target_profile_id = profile.id AND currentUserLike.user_id = '${currentUserProfile.user_id}'
				LEFT JOIN "like" AS likedCurrentUser ON likedCurrentUser.target_profile_id = '${currentUserProfile.id}' AND likedCurrentUser.user_id = "user".id
			`;
	}

	async getUserList(filters: ProfileFilters, userProfile: profile) {
		const query = this.getUserListQuery(filters, userProfile);
		const values = this.getUserListQueryValues(filters);
		const result = await this.dbClient.query(query, values);
		return result.rows;
	}

	private getUserListQuery(filters: ProfileFilters, userProfile: profile): string {
		let i = 1;
		let query = `
			WITH profile_with_distance AS (
				${this.getUserProfileSelectQuery(
					{ latitude: userProfile.location_latitude, longitude: userProfile.location_longitude },
					userProfile, false)}
				WHERE profile.id != '${userProfile.id}'`;

		if (filters.ageMin)
			query += ` AND profile.birth_date <= $${i++}`;
		if (filters.ageMax)
			query += ` AND profile.birth_date > $${i++}`;
		if (filters.fameRateMin)
			query += ` AND profile.fame_rate >= $${i++}`;
		if (filters.fameRateMax)
			query += ` AND profile.fame_rate <= $${i++}`;
		if (filters.tags) {
			query += ` AND profile.id IN (
						SELECT profile_id FROM profile_tag_asso WHERE tag_id IN (
							SELECT id FROM tag WHERE LOWER(label) = ANY($${i++})
						) GROUP BY profile_id HAVING COUNT(DISTINCT tag_id) = ${filters.tags.length}
					)`
		}
		query += ` AND profile.id NOT IN (
			SELECT target_profile_id FROM blacklist WHERE blacklist.user_id = '${userProfile.user_id}'
			)`;
		query += ` AND "user".id NOT IN (
			SELECT user_id FROM blacklist WHERE blacklist.target_profile_id = '${userProfile.id}'
			)`;
		query += this.getSexualProfileFiltersQuery(userProfile);
		query += `
			GROUP BY
				profile.id,
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

	private getSexualProfileFiltersQuery(userProfile: profile): string {
		let query = " AND ";
		const userSexualPreference = userProfile.gender === 'undefined' ? ''
			: `(profile.sexual_preferences = '${userProfile.gender}' OR profile.sexual_preferences='undefined')`;

		switch (userProfile.sexual_preferences) {
			case 'female':
				query += `(profile.gender != 'male' ${userSexualPreference.length ? ' AND' + userSexualPreference : ''})`
				break;
			case 'male':
				query += `(profile.gender != 'female' ${userSexualPreference.length ? ' AND' + userSexualPreference : ''})`
				break;
			default:
				if (userProfile.gender === 'undefined') return " ";
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

	async getMatchingProfiles(currentUserProfile: profile, filters: ProfileFilters) {
		const query = this.getMatchingProfileQuery(currentUserProfile);
		const filterValues = this.getUserListQueryValues(filters);
		const result = await this.dbClient.query(query, filterValues);
		return result.rows;
	}

	private getMatchingProfileQuery(currentUserProfile: profile): string {
		let paramNb = 1
		let query = `
			${this.getMatchingProfileSelectQuery({
			latitude: currentUserProfile.location_latitude,
			longitude: currentUserProfile.location_longitude
		},
			currentUserProfile
		)}
			WHERE profile.id != '${currentUserProfile.id}'
			AND profile.gender = '${currentUserProfile.sexual_preferences}'
			AND profile.sexual_preferences = '${currentUserProfile.gender}'
			GROUP BY
				profile.id,
				"user".username,
				"user".last_name,
				"user".first_name
			ORDER BY
				matching_rate DESC
			LIMIT $${paramNb++} OFFSET $${paramNb++};`;
		return query;
	}

	private getMatchingProfileSelectQuery(userLocation: GeoCoordinate, currentUserProfile: profile): string {
		let commonTagscount = `(
			SELECT COUNT(*) FROM (
				SELECT matching_user_tag.label
				FROM profile_tag_asso
				JOIN tag AS matching_user_tag ON matching_user_tag.id = tag_id
				WHERE profile_id = profile.id
				INTERSECT
				SELECT current_user_tag.label
				FROM profile_tag_asso
				JOIN tag AS current_user_tag ON current_user_tag.id = tag_id
				WHERE profile_id = '${currentUserProfile.id}'
			) AS common_tags
		)`;
		let distance = `calculate_distance(profile.location_latitude, profile.location_longitude, ${userLocation.latitude}, ${userLocation.longitude}, 'K')`
		let fameRateDelta = `ABS(profile.fame_rate - ${currentUserProfile.fame_rate})`
		let matchingFormula = `${commonTagscount} + 1 / (${distance} + ${fameRateDelta} + 1)`

		return `SELECT 
			"user".username,
			"user".last_name,
			"user".first_name,
			profile.id,
			profile.gender,
			profile.birth_date,
			profile.sexual_preferences,
			profile.biography,
			profile.fame_rate,
			MAX(CASE WHEN picture.is_profile_picture THEN picture.id::TEXT END) AS profile_picture_id,
			STRING_AGG(DISTINCT(CASE WHEN NOT picture.is_profile_picture THEN picture.id::text END), ',') AS additionnal_pictures_ids,
			STRING_AGG(DISTINCT(tag.label)::TEXT, ',') AS tags,
			${distance} as distance_km,
			${matchingFormula} AS matching_rate
		FROM profile 
		INNER JOIN "user" ON "user".id = profile.user_id
		LEFT JOIN tag ON tag.id IN (
			SELECT tag_id FROM profile_tag_asso WHERE profile_id = profile.id
		)
		LEFT JOIN picture ON picture.profile_id = profile.id`
	}
}
