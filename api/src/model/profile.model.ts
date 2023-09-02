import { PoolClient } from "pg";
import { ModelBase } from "./base.js";
import { ProfileFilters } from "@shared-models/profile.model.js";

export class ProfileModel extends ModelBase {

	constructor(dbClient: PoolClient) {
		super("profile", dbClient);
	}

	async getUserList(filters: ProfileFilters, userProfile: profile) {
		const query = this.getProfileFiltersQuery(filters, userProfile);
		const values = this.getProfileFiltersQueryValues(filters);
        const result = await this.dbClient.query(query, values);
		console.log(result.rows);
		return result.rows;
	}

	private getProfileFiltersQuery(filters: ProfileFilters, userProfile: profile): string {
		let i = 1;
		let query = `
			WITH profile_with_distance AS (
				SELECT 
					"user".username,
					"user".last_name,
					"user".first_name,
					profile.gender,
					profile.birth_date,
					profile.sexual_preferences,
					profile.biography,
					profile.fame_rate,
					profilePicture.id AS profile_picture_id,
					STRING_AGG(DISTINCT(tag.label)::TEXT, ',') AS tags,
					STRING_AGG(additionnalPicture.id::TEXT, ',') AS additionnal_pictures_ids,
					calculate_distance(profile.location_latitude, profile.location_longitude, ${userProfile.location_latitude}, ${userProfile.location_longitude}, 'K') as distance_km
				FROM profile 
				INNER JOIN "user" ON "user".id = profile.user_id
				LEFT JOIN tag ON tag.id IN (
					SELECT tag_id FROM profile_tag_asso WHERE profile_id = profile.id
				)
				LEFT JOIN picture AS profilePicture ON profilePicture.profile_id = profile.id
				LEFT JOIN picture AS additionnalPicture ON additionnalPicture.profile_id = profile.id
					WHERE profilePicture.is_profile_picture=true
					AND additionnalPicture.is_profile_picture=false`;

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
		query += this.getSexualProfileFiltersQuery(userProfile);
		query += `
			GROUP BY 
				"user".username,
				"user".last_name,
				"user".first_name,
				profile.gender,
				profile.birth_date,
				profile.sexual_preferences,
				profile.biography,
				profile.fame_rate,
				profilePicture.id,
				distance_km
		) SELECT * FROM profile_with_distance`
		if (filters.distanceKilometers)
			query += ` WHERE distance_km <= $${i++}`;
		query += ` LIMIT $${i++} OFFSET $${i++}`;

		return query;
	}

	private getSexualProfileFiltersQuery(userProfile: profile): string {
		let query = " AND ";

		switch (userProfile.sexual_preferences) {
			case 'bisexual':
				query += `profile.sexual_preferences = '${userProfile.gender}'`
				break;
			case 'female':
				query += `profile.gender = 'female' AND profile.sexual_preferences = '${userProfile.gender}'`
				break;
			case 'male':
				query += `profile.gender = 'male' AND profile.sexual_preferences = '${userProfile.gender}'`
				break;
		}
		return query;
	}

	private getProfileFiltersQueryValues(filters: ProfileFilters) {
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
}