import type { Type } from 'arktype';

export const schema_assert = <T extends Type>(schema: T, data: T['infer']) => schema.assert(data);
