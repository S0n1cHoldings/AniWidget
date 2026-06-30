import { aniwidget_api } from '../../../api/index.ts';

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>;

export const fallback: RequestHandler = ({ request }) => aniwidget_api.handle(request);
