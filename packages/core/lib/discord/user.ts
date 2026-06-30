import type { Snowflake } from 'discord-api-types/globals';
import { type APIUser, Routes } from 'discord-api-types/v10';
import { discord_get, REST, rest } from './base.ts';

export const discord_user = (user_id: Snowflake) => discord_get<APIUser>(rest, Routes.user(user_id));

const user_rest = (token: string) =>
	new REST({
		authPrefix: 'Bearer',
	}).setToken(token);

export const discord_user_token = (token: string) => discord_get<APIUser>(user_rest(token), Routes.user());
