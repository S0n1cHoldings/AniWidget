import Elysia from 'elysia';

export const aniwidget_api = new Elysia({ prefix: '/api' });

export type AniWidgetElysia = typeof aniwidget_api;
