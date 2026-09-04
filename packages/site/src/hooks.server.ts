import { db_init } from '@aniwidget/db';
import type { ServerInit } from '@sveltejs/kit';

let initialized = false;

export const init: ServerInit = async () => {
	if (initialized) return;
	initialized = true;
	await db_init();
};
