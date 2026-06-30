import { type } from 'arktype';
import { schema_widget_data } from './discord/index.ts';

const _schema_user_anilist = type({
	id: 'number',
	username: 'string',
	pfp: 'string',
	joined_on: 'string',
	stats: type({
		total_anime: 'number',
		days_watched: 'string',
		anime_mean_score: 'string',
		total_manga: 'number',
		chapters_read: 'number',
		manga_mean_score: 'string',
	}),
});

export const aniwidget_schema_user = type({
	id: 'string',
	display_name: 'string',
	username: 'string',
	avatar: 'string.url | null',
	anilist: _schema_user_anilist.or(type.null),
	widget: schema_widget_data.or(type.null),
});
export type AniWidgetUser = typeof aniwidget_schema_user.infer;
