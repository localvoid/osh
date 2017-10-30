import { TChildren } from "osh";

/**
 * intersperse function intersperses `separator` between elements of an `array`.
 *
 * @param array Children array.
 * @param separator Interspersed element.
 */
export function intersperse(array: TChildren[], separator: TChildren): TChildren[] {
  const r = [];
  if (array.length > 0) {
    r[0] = array[0];
    for (let i = 1; i < array.length; i++) {
      r.push(separator, array[i]);
    }
  }
  return r;
}
