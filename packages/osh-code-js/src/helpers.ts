import { Context, ComponentNode, TChildren, component } from "osh";
import { JSCodeOptions, JS_CODE_OPTIONS } from "./options";

export function jsCodeOptions(ctx: Context): JSCodeOptions {
  const opts = ctx[JS_CODE_OPTIONS];
  if (opts !== void 0) {
    return opts as JSCodeOptions;
  }
  throw new Error("Unable to find JSCodeOptions in the context.");
}

export function TS(ctx: Context, children: TChildren[]): TChildren {
  return jsCodeOptions(ctx).lang === "ts" ? children : null;
}

export function Flow(ctx: Context, children: TChildren[]): TChildren {
  return jsCodeOptions(ctx).lang === "flow" ? children : null;
}

export function ts(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(TS, children);
}

export function flow(...children: TChildren[]): ComponentNode<TChildren[]> {
  return component(Flow, children);
}
