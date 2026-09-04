import { env } from '@aniwidget/utils';
import { connect, model, models } from 'mongoose';
import { type DBUserType, db_schema_user } from './models.ts';

export const DBUser = models.DBUser
	? model<DBUserType>('DBUser')
	: model<DBUserType>('DBUser', db_schema_user, 'users');

export async function db_init() {
	await connect(env.MONGODB_URI);
	await DBUser.init();
}

export * from './models.ts';
