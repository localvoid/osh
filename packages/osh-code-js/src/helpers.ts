import { Context, ComponentNode, TChildren, component } from "osh";
import { jsCodeOptions } from "./options";

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
