import { aniwidget_get_user } from '@aniwidget/core';
import bearer from '@elysia/bearer';
import Elysia from 'elysia';

export const authenticated = new Elysia({ name: 'aniwidget_authenticated' })
	.use(bearer())
	.derive({ as: 'scoped' }, async ({ bearer }) => ({
		user: await aniwidget_get_user(bearer),
	}));
