import { type InferSchemaType, Schema } from 'mongoose';

const _user_anilist_profile = new Schema({
	username: { type: String, required: true },
	pfp: { type: String, required: true },
	total_anime: { type: Number, required: true },
	days_watched: { type: String, required: true },
	anime_mean_score: { type: String, required: true },
	total_manga: { type: Number, required: true },
	chapters_read: { type: Number, required: true },
	manga_mean_score: { type: String, required: true },
	joined_on: { type: String, required: true },
});

const _user_anilist = new Schema({
	token: { type: String, required: true },
	profile: { type: _user_anilist_profile, required: true },
});
export type DBUSerAnilistType = InferSchemaType<typeof _user_anilist>;

export const db_schema_user = new Schema(
	{
		id: { type: String, required: true, unique: true }, // snowflake
		anilist: _user_anilist,
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	},
);

export type DBUserType = InferSchemaType<typeof db_schema_user>;
