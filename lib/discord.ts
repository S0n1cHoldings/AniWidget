import { REST } from '@discordjs/rest';
import type { Snowflake } from 'discord-api-types/globals';
import { type DiscordPayload, type DiscordWidgetData, schema_discord_payload } from '$types.ts';
import { env, schema_assert } from '$utils.ts';

const api = new REST({ version: '9' }).setToken(env.DISCORD_TOKEN);

export const discord_update_profile = (user_id: Snowflake, payload: DiscordPayload) =>
	api.patch(`/applications/${env.DISCORD_CLIENT_ID}/users/${user_id}/identities/${payload.username}/profile`, {
		body: payload,
	});

export const discord_delete_profile = (user_id: Snowflake) =>
	discord_update_profile(user_id, {
		username: 'Disconnected',
		data: { dynamic: [] },
	});

export function discord_payload(widget_data: DiscordWidgetData) {
	return schema_assert(schema_discord_payload, {
		username: widget_data.username,
		data: {
			dynamic: [
				{ type: 3, name: 'pfp', value: { url: widget_data.pfp } },
				{ type: 2, name: 'total_anime', value: widget_data.total_anime },
				{ type: 1, name: 'days_watched', value: widget_data.days_watched },
				{ type: 1, name: 'anime_mean_score', value: widget_data.anime_mean_score },
				{ type: 2, name: 'total_manga', value: widget_data.total_manga },
				{ type: 2, name: 'chapters_read', value: widget_data.chapters_read },
				{ type: 1, name: 'manga_mean_score', value: widget_data.manga_mean_score },
				{ type: 1, name: 'joined_on', value: widget_data.joined_on },
			],
		},
	});
}
