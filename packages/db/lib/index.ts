import { env } from '@aniwidget/utils';
import { connect, model } from 'mongoose';
import { db_schema_user } from './models.ts';

await connect(env.MONGODB_URI);

export const DBUser = model('DBUser', db_schema_user, 'users');
await DBUser.init();

export * from './models.ts';
