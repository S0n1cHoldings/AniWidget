export const md5 = (str: string) => new Bun.MD5().update(str).digest('hex');
