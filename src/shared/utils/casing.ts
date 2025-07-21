export class CasingUtils {
  static snakeToCamel(str: string) {
    return str.toLowerCase().replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
  }
}
