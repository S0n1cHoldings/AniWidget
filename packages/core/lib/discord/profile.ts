import { env } from 'bun';
import type { Snowflake } from 'discord-api-types/globals';
import { discord_get, discord_patch, rest } from './base.ts';
import type { DiscordProfile, DiscordProfilePayload } from './types.ts';

export const discord_profile = (user_id: Snowflake) =>
	discord_get<DiscordProfile>(
		rest,
		`/applications/${env.DISCORD_CLIENT_ID}/users/${user_id}/identities/${user_id}/profile`,
	);

export const discord_profile_update = (user_id: Snowflake, payload: DiscordProfilePayload) =>
	discord_patch(rest, `/applications/${env.DISCORD_CLIENT_ID}/users/${user_id}/identities/${user_id}/profile`, {
		body: payload,
	});

export const discord_profile_remove = (user_id: Snowflake) =>
	discord_profile_update(user_id, {
		username: null,
		data: null,
	});
