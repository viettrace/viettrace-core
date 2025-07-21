import { CasingUtils } from '@src/shared/utils/casing';

export class ObjUtils {
  static convertObjKeysToCamelCase<T extends Record<string, unknown>>(
    obj: T,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = CasingUtils.snakeToCamel(key);
      result[camelKey] = value;
    }

    return result;
  }

  static isPlainObject(value: unknown): value is object {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.prototype.toString.call(value) === '[object Object]'
    );
  }
}
