import { Context } from "osh";

export interface GOCodeOptions {
  readonly removeComments: boolean;
}

export const GO_CODE_OPTIONS = Symbol("GOCodeOptions");

export const DEFAULT_OPTIONS: GOCodeOptions = {
  removeComments: false,
};

export function goCodeOptions(ctx: Context): GOCodeOptions {
  const opts = ctx[GO_CODE_OPTIONS];
  if (opts !== void 0) {
    return opts as GOCodeOptions;
  }
  throw new Error("Unable to find JSCodeOptions in the context.");
}
