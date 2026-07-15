import { type DBUSerAnilistType, DBUser } from '@aniwidget/db';
import { env, schema_assert, try_prom } from '@aniwidget/utils';
import { status } from 'elysia';
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';
import { type AnilistProfile, anilist_profile } from './anilist/index.ts';
import {
	CDNRoutes,
	type DiscordProfile,
	discord_profile,
	discord_profile_payload,
	discord_profile_update,
	discord_user,
	ImageFormat,
	type Snowflake,
	schema_widget_data,
} from './discord/index.ts';
import type { AniWidgetUser } from './types.ts';

interface AniWidgetJWT extends JWTPayload {
	user_id: Snowflake;
}

const secret = new TextEncoder().encode(env.JWT_SECRET);

const _db_user = async (user_id: Snowflake) =>
	(await DBUser.findOne({ id: user_id })) ?? (await DBUser.create({ id: user_id }));

async function _pre_user(user_id: Snowflake) {
	const user = await discord_user(user_id);
	const profile = await try_prom(discord_profile(user_id));

	const widget = profile ? _parse_widget(profile) : null;

	return {
		id: user.id,
		global_name: user.global_name,
		username: user.username,
		avatar: user.avatar,
		widget,
	};
}

function _parse_widget(x: DiscordProfile) {
	const pfp = x.data.dynamic.filter((x) => x.type === 3).find((x) => x.name === 'pfp')?.value.url;
	const joined_on = x.data.dynamic.filter((x) => x.type === 1).find((x) => x.name === 'joined_on')?.value;
	const total_anime = x.data.dynamic.filter((x) => x.type === 2).find((x) => x.name === 'total_anime')?.value;
	const days_watched = x.data.dynamic.filter((x) => x.type === 1).find((x) => x.name === 'days_watched')?.value;
	const anime_mean_score = x.data.dynamic
		.filter((x) => x.type === 1)
		.find((x) => x.name === 'anime_mean_score')?.value;
	const total_manga = x.data.dynamic.filter((x) => x.type === 2).find((x) => x.name === 'total_manga')?.value;
	const chapters_read = x.data.dynamic.filter((x) => x.type === 2).find((x) => x.name === 'chapters_read')?.value;
	const manga_mean_score = x.data.dynamic
		.filter((x) => x.type === 1)
		.find((x) => x.name === 'manga_mean_score')?.value;

	if (
		pfp == null ||
		joined_on == null ||
		total_anime == null ||
		days_watched == null ||
		anime_mean_score == null ||
		total_manga == null ||
		chapters_read == null ||
		manga_mean_score == null
	)
		throw status(500);

	return schema_assert(schema_widget_data, {
		username: x.username,
		pfp,
		joined_on,
		stats: {
			total_anime,
			days_watched,
			anime_mean_score,
			total_manga,
			chapters_read,
			manga_mean_score,
		},
	});
}

const _db_to_widget_data = (x: DBUSerAnilistType['profile']) =>
	schema_assert(schema_widget_data, {
		username: x.username,
		pfp: x.pfp,
		joined_on: x.joined_on,
		stats: {
			total_anime: x.stats.total_anime,
			days_watched: x.stats.days_watched,
			anime_mean_score: x.stats.anime_mean_score,
			total_manga: x.stats.total_manga,
			chapters_read: x.stats.chapters_read,
			manga_mean_score: x.stats.manga_mean_score,
		},
	});

const _raw_anilist_profile_to_db = (x: AnilistProfile): DBUSerAnilistType['profile'] => {
	if (!x.statistics?.anime || !x.statistics.manga || !x.createdAt)
		throw status(500, { error: 'something is up with this' });
	return {
		id: x.id,
		username: x.name,
		pfp: x.avatar?.large ?? 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png',
		joined_on: new Date(x.createdAt * 1000).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}),
		stats: {
			total_anime: x.statistics.anime.count,
			days_watched: (+(x.statistics.anime.minutesWatched / 60 / 24)).toFixed(1),
			anime_mean_score: x.statistics.anime.meanScore.toFixed(1),
			total_manga: x.statistics.manga.count,
			chapters_read: x.statistics.manga.chaptersRead,
			manga_mean_score: x.statistics.manga.meanScore.toFixed(1),
		},
	};
};

type PreUser = Awaited<ReturnType<typeof _pre_user>>;

async function _update_discord(user_id: Snowflake, profile: DBUSerAnilistType['profile']) {
	const data = _db_to_widget_data(profile);
	await discord_profile_update(user_id, discord_profile_payload(data));
}

export async function aniwidget_set(user_id: Snowflake) {
	const db_user = await _db_user(user_id);
	if (!db_user.anilist) throw status(400, { error: 'not linked to anilist.' });
	await _update_discord(user_id, db_user.anilist.profile);
	const jwt = await aniwidget_jwt(user_id);
	return aniwidget_get_user(jwt);
}

export async function aniwidget_update(user_id: Snowflake) {
	const db_user = await _db_user(user_id);
	if (!db_user.anilist) throw status(400, { error: 'not linked to anilist.' });
	const user = await _pre_user(user_id);
	const anilist = await anilist_profile({ discord_id: user.id });

	db_user.anilist.profile = _raw_anilist_profile_to_db(anilist);

	await db_user.save();

	await _update_discord(user.id, db_user.anilist.profile);
	const jwt = await aniwidget_jwt(user.id);
	return aniwidget_get_user(jwt);
}

export async function aniwidget_anilist_save(user_id: Snowflake, token: string) {
	const user = await _pre_user(user_id);
	const anilist = await anilist_profile({ discord_id: user.id, token });

	if (!anilist.statistics?.anime || !anilist.statistics.manga || !anilist.createdAt)
		throw status(500, { error: 'something is up with this' });

	const db_user = await _db_user(user.id);
	db_user.anilist = {
		token,
		profile: _raw_anilist_profile_to_db(anilist),
	};
	const res = await db_user.save();

	return _format_user(user, res.anilist?.profile ?? null);
}

export async function aniwidget_get_user(jwt?: string): Promise<AniWidgetUser> {
	if (!jwt) throw status(401, { error: 'Unauthorized' });
	const res = await jwtVerify<AniWidgetJWT>(jwt, secret);
	const { user_id } = res.payload;
	const user = await _pre_user(user_id);
	const anilist = (await _db_user(user.id)).anilist?.profile ?? null;

	return _format_user(user, anilist);
}

const _format_user = (user: PreUser, anilist: DBUSerAnilistType['profile'] | null) => ({
	id: user.id,
	display_name: user.global_name ?? user.username,
	username: user.username,
	avatar: _user_avatar(user.id, user.avatar),
	anilist,
	widget: user.widget,
});

function _user_avatar(user_id: Snowflake, avatar: string | null) {
	if (!avatar) return null;
	const path = CDNRoutes.userAvatar(user_id, avatar, avatar.startsWith('a_') ? ImageFormat.WebP : ImageFormat.PNG);
	const url = new URL(path, 'https://cdn.discordapp.com/');
	if (avatar.startsWith('a_')) url.searchParams.set('animated', 'true');
	return url.toString();
}

export const aniwidget_jwt = (user_id: Snowflake) =>
	new SignJWT({ user_id })
		.setIssuer('aniwidget-api')
		.setAudience('aniwidget-site')
		.setExpirationTime('1 year')
		.setProtectedHeader({
			alg: 'HS256',
		})
		.sign(secret);

export * from './discord/index.ts';
export * from './types.ts';
