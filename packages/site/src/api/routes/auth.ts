import { aniwidget_jwt, discord_app, discord_user_token, OAuth2Scopes } from '@aniwidget/core';
import { BASE_URL, env } from '@aniwidget/utils';
import Elysia, { status } from 'elysia';
import { oauth2 } from 'elysia-oauth2';

const discord = new Elysia({ prefix: '/discord' })
	.use(
		oauth2({
			Discord: [
				env.DISCORD_CLIENT_ID,
				env.DISCORD_CLIENT_SECRET,
				BASE_URL('/api/auth/discord/callback').toString(),
			],
		}),
	)
	.get('/', ({ oauth2 }) => oauth2.redirect('Discord', [OAuth2Scopes.Identify]))
	.get('/callback', async ({ oauth2, redirect }) => {
		const tokens = await oauth2.authorize('Discord');
		const access_token = tokens.accessToken();

		const user = await discord_user_token(access_token);

		const app = await discord_app();
		if (!app.team) throw status(500, { error: 'AniWidget application setup wrong, must be a team.' });

		const member = app.team.members.find((x) => x.user.id === user.id);

		if (!member) throw status(401, { error: 'Unauthorized.' });

		return redirect('/api/auth/discord-social', 302);
	});

const discord_social = new Elysia({ prefix: '/discord-social' })
	.use(
		oauth2({
			Discord: [
				env.DISCORD_CLIENT_ID,
				env.DISCORD_CLIENT_SECRET,
				BASE_URL('/api/auth/discord-social/callback').toString(),
			],
		}),
	)
	.get('/', ({ oauth2 }) => oauth2.redirect('Discord', [OAuth2Scopes.Identify, 'openid', 'sdk.social_layer']))
	.get('/callback', async ({ oauth2, redirect }) => {
		const tokens = await oauth2.authorize('Discord');
		const access_token = tokens.accessToken();

		const user = await discord_user_token(access_token);

		const token = await aniwidget_jwt(user.id);
		const url = BASE_URL('/auth/discord');
		url.hash = new URLSearchParams({
			token,
		}).toString();

		return redirect(url.toString(), 302);
	});

const anilist = new Elysia({ prefix: '/anilist' })
	.use(
		oauth2({
			AniList: [
				env.ANILIST_CLIENT_ID.toString(),
				env.ANILIST_CLIENT_SECRET,
				BASE_URL('/api/auth/anilist/callback').toString(),
			],
		}),
	)
	.get('/', ({ oauth2 }) => oauth2.redirect('AniList'))
	.get('/callback', async ({ oauth2, redirect }) => {
		const tokens = await oauth2.authorize('AniList');
		const access_token = tokens.accessToken();

		const url = BASE_URL('/auth/anilist');
		url.hash = new URLSearchParams({
			token: access_token,
		}).toString();

		console.log({ url });

		return redirect(url.toString(), 302);
	});

export default new Elysia({ prefix: '/auth' }).use(discord).use(discord_social).use(anilist);
