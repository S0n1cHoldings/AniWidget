import { DBUser } from '@aniwidget/db';
import { AniWidgetCache, env, md5 } from '@aniwidget/utils';
import type { Snowflake } from '@warsam-e/echo';
import {
	AniQLClient,
	type AniQLRequestOptions,
	type FieldsSelection,
	type Query,
	type QueryGenqlSelection,
} from 'aniql';

interface AniListClient {
	query: <R extends QueryGenqlSelection>(
		request: R & {
			__name?: string;
		},
		opts?: AniQLRequestOptions,
	) => Promise<FieldsSelection<Query, R>>;
}

const _get_client = (discord_id: Snowflake): AniListClient => {
	const client = new AniQLClient({
		auth: {
			response_type: 'token',
			client_id: env.ANILIST_CLIENT_ID,
		},
		get_token: async () => {
			const user = await DBUser.findOne({ id: discord_id }).lean();
			const token = user?.anilist?.token;
			if (token) return token;
		},
	});

	const cache = new AniWidgetCache(`anilist:${discord_id}`);

	return {
		query: (request, opts) => {
			const key = md5(JSON.stringify(request));
			return cache.wrap(key, '10 minutes later', () => client.query(request, opts));
		},
	};
};

export const anilist_profile = async (discord_id: Snowflake) => {
	const client = _get_client(discord_id);
	const user = await client
		.query({
			Viewer: {
				id: true,
				name: true,
				avatar: {
					large: true,
				},
				statistics: {
					anime: { count: true, minutesWatched: true, meanScore: true },
					manga: { count: true, chaptersRead: true, meanScore: true },
				},
				createdAt: true,
			},
		})
		.then((x) => x.Viewer);
	if (!user) throw new Error('user not found (somehow).');
	return user;
};

export function anilist_login_url() {
	const url = new URL('https://anilist.co/api/v2/oauth/authorize');

	url.searchParams.set('client_id', env.ANILIST_CLIENT_ID.toString());
	url.searchParams.set('response_type', 'token');

	return url.toString();
}
