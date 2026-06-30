import { aniwidget_anilist_save, aniwidget_schema_user, aniwidget_update } from '@aniwidget/core';
import { type } from 'arktype';
import Elysia from 'elysia';
import { authenticated } from '../plugins/index.ts';

export default new Elysia({ prefix: '/user' })
	.use(authenticated)
	.get('/', ({ user }) => user, {
		response: aniwidget_schema_user,
	})
	.post('/anilist_login', ({ user, body }) => aniwidget_anilist_save(user.id, body.token), {
		body: type({ token: 'string' }),
		response: aniwidget_schema_user,
	})
	.post('/update', ({ user }) => aniwidget_update(user.id), {
		response: aniwidget_schema_user,
	});
