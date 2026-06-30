import { schema_assert } from '@aniwidget/utils';
import { type APIApplication, discord_get, Routes, rest } from './base.ts';
import { type DiscordWidgetData, schema_discord_profile_payload } from './types.ts';

export function discord_profile_payload(widget_data: DiscordWidgetData) {
	return schema_assert(schema_discord_profile_payload, {
		username: widget_data.username,
		data: {
			dynamic: [
				{ type: 3, name: 'pfp', value: { url: widget_data.pfp } },
				{ type: 2, name: 'total_anime', value: widget_data.stats.total_anime },
				{ type: 1, name: 'days_watched', value: widget_data.stats.days_watched },
				{ type: 1, name: 'anime_mean_score', value: widget_data.stats.anime_mean_score },
				{ type: 2, name: 'total_manga', value: widget_data.stats.total_manga },
				{ type: 2, name: 'chapters_read', value: widget_data.stats.chapters_read },
				{ type: 1, name: 'manga_mean_score', value: widget_data.stats.manga_mean_score },
				{ type: 1, name: 'joined_on', value: widget_data.joined_on },
			],
		},
	});
}

export const discord_app = () => discord_get<APIApplication>(rest, Routes.currentApplication());

export * from './base.ts';
export * from './profile.ts';
export * from './types.ts';
export * from './user.ts';
