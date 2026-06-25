import Elysia from 'elysia';
import auth from './auth.ts';

export default new Elysia().use(auth);
