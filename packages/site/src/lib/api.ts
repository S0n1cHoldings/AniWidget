import { type Treaty, treaty } from '@elysia/eden';
import type { AniWidgetElysia } from '../api/index.ts';
import { store_val, user_token } from './stores.ts';

const client = treaty<AniWidgetElysia>(location.origin, {
	headers: () => {
		const token = store_val(user_token);
		if (!token) return;
		return { Authorization: `Bearer ${token}` };
	},
});

export class AniWidgetAPIError extends Error {
	code: number;
	constructor(code: number, message: string) {
		super(message);
		this.code = code;
		this.name = 'AniWidgetAPIError';
	}
}

function _handle_request<Res extends Record<number, unknown>, Args extends unknown[]>(
	orig_method: (...args: Args) => Promise<Treaty.TreatyResponse<Res>>,
) {
	return async (...args: Args) => {
		const res = await orig_method(...args);
		if (res.status === 200 && res.data) return res.data;
		throw new AniWidgetAPIError(res.status, JSON.stringify(res.error, null, 4));
	};
}

export const api = {
	user: {
		get: _handle_request(() => client.api.user.get()),
		anilist_login: _handle_request((token: string) => client.api.user.anilist_login.post({ token })),
		update: _handle_request(() => client.api.user.update.post()),
	},
};
