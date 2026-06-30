import { type } from 'arktype';

const schema_discord_profile_item_base = type({
	name: type.string,
});

const schema_discord_profile_string_item = schema_discord_profile_item_base.merge({
	type: '1',
	value: 'string',
});

const schema_discord_profile_number_item = schema_discord_profile_item_base.merge({
	type: '2',
	value: 'number.integer',
});

const schema_discord_profile_media_item = schema_discord_profile_item_base.merge({
	type: '3',
	value: type({ url: 'string' }),
});

const schema_discord_profile_item = type.or(
	schema_discord_profile_string_item,
	schema_discord_profile_number_item,
	schema_discord_profile_media_item,
);

const schema_discord_profile_payload_data = type({
	dynamic: schema_discord_profile_item.array(),
});

export const schema_discord_profile_payload = type({
	username: type.string.or(type.null),
	data: schema_discord_profile_payload_data.or(type.null),
});
export const schema_discord_profile = type({ username: type.string, data: schema_discord_profile_payload_data });
export type DiscordProfilePayload = typeof schema_discord_profile_payload.infer;
export type DiscordProfile = typeof schema_discord_profile.infer;

export const schema_widget_data = type({
	username: 'string',
	pfp: 'string.url',
	joined_on: 'string',
	stats: type({
		total_anime: 'number.integer',
		days_watched: 'string.numeric',
		anime_mean_score: 'string.numeric',
		total_manga: 'number.integer',
		chapters_read: 'number.integer',
		manga_mean_score: 'string.numeric',
	}),
});
export type DiscordWidgetData = typeof schema_widget_data.infer;
