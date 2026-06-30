import type { AniWidgetUser } from '@aniwidget/core';
import { get, writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

export const user_token = persisted<string | null>('aniwidget_token', null);

export const user = writable<AniWidgetUser | null>(null);

export const mounted = writable(false);

export const store_val = get;
