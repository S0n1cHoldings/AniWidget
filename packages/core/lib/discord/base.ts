import { env } from '@aniwidget/utils';
import { REST, type RequestData, type RouteLike } from '@discordjs/rest';

export const rest = new REST({ version: '9' }).setToken(env.DISCORD_TOKEN);

export const discord_get = <T>(rest: REST, route: RouteLike, options?: RequestData) =>
	rest.get(route, options) as Promise<T>;
export const discord_patch = <T>(rest: REST, route: RouteLike, options?: RequestData) =>
	rest.patch(route, options) as Promise<T>;

export * from '@discordjs/rest';
export * from 'discord-api-types/v10';
