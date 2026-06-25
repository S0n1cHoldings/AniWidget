import type { Snowflake } from '@warsam-e/echo';
import { BunDB } from 'bun.db';
import { assets_root, join } from '$utils.ts';

const db = new BunDB(join(assets_root, 'anilist.sqlite'));

export const _db_anilist_auth_get = (discord_id: Snowflake) => db.get<string>(`auth:${discord_id}`);
export const _db_anilist_auth_set = (discord_id: Snowflake, token: string) => db.set(`auth:${discord_id}`, token);
export const _db_anilist_auth_delete = (discord_id: Snowflake) => db.delete(`auth:${discord_id}`);
