import { join } from 'node:path';
import arkenv from 'arkenv';

import { config } from 'dotenv';

export const proj_root = join(import.meta.url.replace('file://', ''), '../../../..');
console.log({
	proj_root,
	NODE_ENV: Bun.env.NODE_ENV,
});

export { join };

if (Bun.env.NODE_ENV !== 'production') config({ path: join(proj_root, '.env'), quiet: true });

export const env = arkenv({
	JWT_SECRET: 'string',

	NODE_ENV: "'development' | 'production' | 'test' = 'development'",

	MONGODB_URI: 'string.url',

	BASE_URL: 'string.url',

	DISCORD_TOKEN: 'string',
	DISCORD_CLIENT_ID: 'string',
	DISCORD_CLIENT_SECRET: 'string',

	ANILIST_CLIENT_ID: 'number',
	ANILIST_CLIENT_SECRET: 'string',
});

export const IS_PROD = env.NODE_ENV === 'production';

export const BASE_URL = (path: string) => new URL(path, env.BASE_URL);
