import { DBUser } from '@aniwidget/db';
import { AniWidgetCache, env, md5 } from '@aniwidget/utils';
import {
	AniQLClient,
	type AniQLRequestOptions,
	type FieldsSelection,
	type Query,
	type QueryGenqlSelection,
} from 'aniql';
import type { Snowflake } from '../discord/index.ts';

interface AniListClient {
	query: <R extends QueryGenqlSelection>(
		request: R & {
			__name?: string;
		},
		opts?: AniQLRequestOptions,
	) => Promise<FieldsSelection<Query, R>>;
}

interface AniListClientQuery {
	discord_id: Snowflake;
	token?: string;
}

const _get_client = (query: AniListClientQuery): AniListClient => {
	const client = new AniQLClient({
		auth: {
			response_type: 'token',
			client_id: env.ANILIST_CLIENT_ID,
		},
		get_token: async () => {
			if (query.token) return query.token;
			const user = await DBUser.findOne({ id: query.discord_id }).lean();
			const token = user?.anilist?.token;
			if (token) return token;
		},
	});

	const cache = new AniWidgetCache(`anilist:${query.discord_id}`);

	return {
		query: (request, opts) => {
			const key = md5(JSON.stringify(request));
			return cache.wrap(key, '10 minutes later', () => client.query(request, opts));
		},
	};
};

export const anilist_profile = async (query: AniListClientQuery) => {
	const client = _get_client(query);
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

export type AnilistProfile = Awaited<ReturnType<typeof anilist_profile>>;
