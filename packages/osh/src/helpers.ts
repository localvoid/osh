import { TChildren } from "./tnode";

export function join(array: TChildren[], separator: TChildren): TChildren[] {
  const r = [];
  if (array.length > 0) {
    r[0] = array[0];
    for (let i = 1; i < array.length; i++) {
      r.push(separator, array[i]);
    }
  }
  return r;
}
