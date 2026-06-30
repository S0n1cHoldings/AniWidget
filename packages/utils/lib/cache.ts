import { MongoDBDriver, Stash } from '@warsam-e/stash';
import { env } from './env.ts';

export const _cache_driver = await MongoDBDriver.create(env.MONGODB_URI, 'aniwidget_cache');

export class AniWidgetCache extends Stash {
	base_key: string;
	constructor(base_key: string) {
		super(base_key, {
			driver: _cache_driver,
		});
		this.base_key = base_key;
	}

	// async wrap<T>(key: string, duration: StashDuration, fn: () => Awaitable<T>): Promise<T> {
	// 	return record('AniWidgetCache.wrap', () => {
	// 		setAttributes({
	// 			'aniwidget.key': `${this.base_key}:${key}`,
	// 			'aniwidget.duration': duration,
	// 		});
	// 		return super.wrap<T>(key, duration, fn);
	// 	});
	// }

	static create = (base_key: string) => new AniWidgetCache(base_key);
}
