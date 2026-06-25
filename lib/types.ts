import { type } from 'arktype';

const schema_discord_item_base = type({
	name: type.string,
});

const schema_discord_string_item = schema_discord_item_base.merge({
	type: '1',
	value: 'string',
});

const schema_discord_number_item = schema_discord_item_base.merge({
	type: '2',
	value: 'number.integer',
});

const schema_discord_media_item = schema_discord_item_base.merge({
	type: '3',
	value: type({ url: 'string' }),
});

const schema_discord_item = type.or(schema_discord_string_item, schema_discord_number_item, schema_discord_media_item);

export const schema_discord_payload = type({
	username: type.string,
	data: type({
		dynamic: schema_discord_item.array(),
	}),
});

export type DiscordPayload = typeof schema_discord_payload.infer;

export const schema_widget_data = type({
	username: 'string',
	pfp: 'string.url',
	total_anime: 'number.integer',
	days_watched: 'string.numeric',
	anime_mean_score: 'string.numeric',
	total_manga: 'number.integer',
	chapters_read: 'number.integer',
	manga_mean_score: 'string.numeric',
	joined_on: 'string',
});
export type DiscordWidgetData = typeof schema_widget_data.infer;
