export const md5 = (str: string) => new Bun.MD5().update(str).digest('hex');

export async function try_prom<T>(prom: Promise<T> | T | undefined) {
	try {
		return await prom;
	} catch {}
}
