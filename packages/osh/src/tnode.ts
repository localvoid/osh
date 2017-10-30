import { Context } from "./context";

/**
 * TNodeType is an enumeration of `TNode` types.
 */
export const enum TNodeType {
  /**
   * `ComponentNode` node.
   */
  Component = 0,
  /**
   * `ContextNode` node.
   */
  Context = 1,
  /**
   * `TransformNode node.
   */
  Transform = 2,
}

/**
 * TNode type represents all possible node types.
 */
export type TNode =
  | ComponentNode<any>
  | ContextNode
  | TransformNode;

/**
 * TChildren is a recursive array of `TNode` objects, strings, numbers and null values.
 */
export type TChildren = TChildrenArray | TNode | string | number | null;
/* tslint:disable:no-empty-interface */
export interface TChildrenArray extends Array<TChildren> { }
/* tslint:enable:no-empty-interface */

/**
 * ComponentNode is a component node that has access to the current context and can produce another nodes when it is
 * rendered to string.
 */
export interface ComponentNode<P = undefined> {
  /**
   * type should have `TNodeType.Component` value.
   */
  readonly type: TNodeType.Component;
  /**
   * fn is a function that will be invoked when component is rendered to string.
   */
  readonly fn: (context: Context, props: P) => TChildren;
  /**
   * props is a properties that will be used as a second argument when `fn` function is invoked.
   */
  readonly props: P;
}

/**
 * ContextNode is used to assign values to the current context.
 */
export interface ContextNode<T = {}> {
  /**
   * type should have `TNodeType.Context` value.
   */
  readonly type: TNodeType.Context;
  /**
   * context is an object that will be merged (`Object.assign()`) to the current context.
   */
  readonly context: Context<T>;
  /**
   * children is an array of children nodes that will contain `context` object associated with their current context.
   */
  readonly children: TChildren[];
}

/**
 * TransformNode performs a transformation on a rendered string.
 */
export interface TransformNode {
  /**
   * type should have `TNodeType.Transform` value.
   */
  readonly type: TNodeType.Transform;
  /**
   * fn is a transformation function that will be invoked when all `children` nodes are rendered to string.
   */
  readonly fn: (s: string, context: Context) => string;
  /**
   * children is an array of children nodes that will be transformed with `fn` function.
   */
  readonly children: TChildren[];
}

/**
 * context is a factory function that creates `ContextNode` nodes.
 *
 * Context nodes are used to assign values to the current context.
 *
 *     renderToString(
 *       context(
 *         {
 *           key: "value",
 *         },
 *         component((ctx) => ctx.key),
 *       },
 *     );
 *     // => "value"
 *
 * @param ctx Context values.
 * @param children Children nodes.
 * @returns `ContextNode` object.
 */
export function context<T = {}>(ctx: Context<T>, ...children: TChildren[]): ContextNode<T> {
  return { type: TNodeType.Context, context: ctx, children };
}

/**
 * component is a factory function that creates `ComponentNode` nodes.
 *
 * Component nodes are used to get access to the current context and produce another nodes when they are rendered to
 * string.
 *
 *     renderToString(
 *       context(
 *         {
 *           key: "value",
 *         },
 *         component((ctx) => ctx.key),
 *       },
 *     );
 *     // => "value"
 *
 * @param fn Component function.
 * @param props Component properties.
 * @returns `ComponentNode` node.
 */
export function component(fn: () => TChildren): ComponentNode<undefined>;
export function component(fn: (context: Context) => TChildren): ComponentNode<undefined>;
export function component<T>(fn: (context: Context, props: T) => TChildren, props: T): ComponentNode<T>;
export function component(fn: (context: Context, props: any) => TChildren, props?: any): ComponentNode<any> {
  return { type: TNodeType.Component, fn, props };
}

/**
 * transform is a factory function that creates `TransformNode` nodes.
 *
 * Transform nodes are used to perform transformation on a rendered strings.
 *
 *     renderToString(
 *       transform(
 *         (s) => s + "Z",
 *         ["a", "b", "c"],
 *       ),
 *     );
 *     // => "abcZ"
 *
 * @param fn Transformation function.
 * @param children Children nodes.
 * @returns `TransformNode` node.
 */
export function transform(fn: (s: string, context: Context) => string, ...children: TChildren[]): TransformNode {
  return { type: TNodeType.Transform, fn, children };
}
