import { BASE_URL } from '@aniwidget/utils';
import cors from '@elysia/cors';
import Elysia from 'elysia';
import routes from './routes/index.ts';

export const aniwidget_api = new Elysia({ prefix: '/api' })
	.use(cors())
	.get('/', ({ redirect }) => redirect(BASE_URL('/api/docs').toString(), 302))
	.use(routes);

export type AniWidgetElysia = typeof aniwidget_api;
