import Echo, { type MessageCreateOptions, type User, type UserResolvable } from '@warsam-e/echo';
import { start_api } from '$api/index.ts';
import cmds from '$cmds/index.ts';
import { API_URL, env } from '$utils.ts';

export class AniWidget extends Echo {
	constructor() {
		super({
			name: 'AniWidget',
			color: '#2e51a2',
		});
	}

	get self() {
		if (!this.user) throw new Error('something is up...');
		return this.user;
	}

	get discord_oauth_url() {
		return API_URL('/auth/discord');
	}

	async send_user(_user: UserResolvable, opt: MessageCreateOptions) {
		const user = await this.users.fetch(_user);
		const dm = user.dmChannel ?? (await user.createDM());
		dm.send(opt);
	}

	is_whitelisted(user: User) {
		return this.owners.some((x) => x.equals(user));
	}

	get invite() {
		const url = new URL('oauth2/authorize', 'https://discord.com');
		url.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
		return url.toString();
	}

	static async start() {
		await start_api();
		const bot = new AniWidget();
		return bot.registerCommands(cmds).init(env.DISCORD_TOKEN);
	}
}

export const bot = await AniWidget.start();
