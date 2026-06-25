import { type APIUser, OAuth2Scopes, REST, Routes, userMention } from '@warsam-e/echo';
import Elysia, { status } from 'elysia';
import { oauth2 } from 'elysia-oauth2';
import { bot } from '$index.ts';
import { API_URL, env } from '$utils.ts';

const discord = new Elysia({ prefix: '/discord' })
	.use(
		oauth2({
			Discord: [env.DISCORD_CLIENT_ID, env.DISCORD_CLIENT_SECRET, API_URL('/auth/discord/callback')],
		}),
	)
	.get('/', ({ oauth2 }) => oauth2.redirect('Discord', [OAuth2Scopes.Identify, 'openid', 'sdk.social_layer']))
	.get('/callback', async ({ oauth2 }) => {
		const tokens = await oauth2.authorize('Discord');
		const access_token = tokens.accessToken();

		const rest = new REST({ authPrefix: 'Bearer' }).setToken(access_token);

		const user = (await rest.get(Routes.user())) as APIUser;
		const name = user.global_name ?? user.username;
		if (!name) return status(500);

		await bot.send_user(user.id, {
			content: `Hey ${userMention(user.id)}! We've succeeded in getting the Profile Widget permissions.`,
		});

		return { message: `AniWidget connected to ${name}. You may now close this window.` };
	});

export default new Elysia({ prefix: '/auth' }).use(discord);
