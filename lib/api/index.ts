import Elysia from 'elysia';
import { env } from '$utils.ts';
import routes from './routes/index.ts';

export function start_api() {
	return new Promise((resolve) =>
		new Elysia()
			.get('/health', () => ({ status: 'ok' }))
			.use(routes)
			.listen(env.PORT, () => {
				console.log(`Live at port ${env.PORT}`);
				resolve(null);
			}),
	);
}
