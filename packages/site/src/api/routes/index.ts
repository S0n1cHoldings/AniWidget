import Elysia from 'elysia';
import auth from './auth.ts';
import user from './user.ts';

export default new Elysia().use(auth).use(user);
