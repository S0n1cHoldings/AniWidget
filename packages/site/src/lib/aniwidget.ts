import type { AniWidgetUser } from '@aniwidget/core';
import { api } from './api.ts';
import { mounted, user } from './stores.ts';

export async function aniwidget_init(_token: string | null) {
	mounted.set(false);
	let res: AniWidgetUser | null = null;
	if (_token) {
		try {
			res = await api.user.get();
		} catch {}
		if (res) user.set(res);
	} else {
		user.set(null);
	}
	mounted.set(true);
}

export async function aniwidget_anilist_auth(token: string) {
	const res = await api.user.anilist_login(token);
	user.set(res);
}

export async function aniwidget_set() {
	const res = await api.user.set();
	user.set(res);
}

export async function aniwidget_update() {
	const res = await api.user.update();
	user.set(res);
}
