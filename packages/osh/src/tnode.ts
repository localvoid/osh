import { Context } from "./context";

export const enum TNodeType {
  Component = 0,
  Context = 1,
}

export type TNode =
  | ComponentNode<any>
  | ContextNode;

export type TChildren = TChildrenArray | TNode | string | number | null;
/* tslint:disable:no-empty-interface */
export interface TChildrenArray extends Array<TChildren> { }
/* tslint:enable:no-empty-interface */

export interface ComponentNode<P = null> {
  readonly type: TNodeType.Component;
  readonly fn: (context: Context, props: P) => TChildren;
  readonly props: P;
}

export interface ContextNode {
  readonly type: TNodeType.Context;
  readonly context: { [key: string]: string };
  readonly children: TChildren;
}

export function context(ctx: Context, children: TChildren): ContextNode {
  return { type: TNodeType.Context, context: ctx, children };
}

export function component(fn: () => TChildren): ComponentNode<undefined>;
export function component(fn: (context: Context) => TChildren): ComponentNode<undefined>;
export function component<T>(fn: (context: Context, props: T) => TChildren, props: T): ComponentNode<T>;
export function component(fn: (context: Context, props: any) => TChildren, props?: any): ComponentNode<any> {
  return { type: TNodeType.Component, fn, props };
}

export function componentFactory(fn: (context: Context) => TChildren): () => TChildren;
export function componentFactory<T>(fn: (context: Context, props: T) => TChildren): (props: T) => TChildren;
export function componentFactory(fn: (context: Context, props: any) => TChildren): (props?: any) => TChildren {
  return (props?: any) => {
    return component(props);
  };
}
