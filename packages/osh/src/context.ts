/**
 * Context is an object with an arbitrary set of properties.
 *
 * `renderToString(node)` function automatically merges context objects with `Object.assign()` function and propagates
 * current context through component trees.
 *
 * `context(ctx, ...children)` function is used to assign values to the current context.
 *
 *     renderToString(
 *       context(
 *         {
 *           key: value,
 *         },
 *         children,
 *       ),
 *     );
 */
export type Context<T = {}> = T & { [key: string]: any };
