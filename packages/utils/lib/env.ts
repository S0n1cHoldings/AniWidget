import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import arkenv from 'arkenv';
import type { Type } from 'arktype';

export const proj_root = join(import.meta.path, '../../../..');
export const assets_root = join(proj_root, 'assets');
await mkdir(assets_root, { recursive: true });

export { join };

export const env = arkenv({
	MONGODB_URI: 'string.url',

	PORT: 'number',
	API_BASE_URL: 'string.url',

	DISCORD_TOKEN: 'string',
	DISCORD_CLIENT_ID: 'string',
	DISCORD_CLIENT_SECRET: 'string',

	ANILIST_CLIENT_ID: 'number',
});

export const API_URL = (path: string) => new URL(path, env.API_BASE_URL).toString();

export const schema_assert = <T extends Type>(schema: T, data: T['infer']) => schema.assert(data);
