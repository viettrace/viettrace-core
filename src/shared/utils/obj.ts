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
}
