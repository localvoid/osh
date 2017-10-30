import { Context } from "./context";
import { TNodeType, TNode, TChildren } from "./tnode";

function renderNodeArray(nodes: TChildren[], context: Context, stackTrace: TNode[]): string {
  let r = "";
  for (const node of nodes) {
    if (typeof node === "object") {
      if (node !== null) {
        r += (Array.isArray(node)) ?
          renderNodeArray(node, context, stackTrace) :
          renderNode(node, context, stackTrace);
      }
    } else if (typeof node === "string") {
      r += node;
    } else if (typeof node === "number") {
      r += node.toString();
    }
  }
  return r;
}

function renderNode(node: TNode, context: Context, stackTrace: TNode[]): string {
  stackTrace.push(node);

  let c;
  if (node.type === TNodeType.Component) {
    c = node.fn(context, node.props);
  } else if (node.type === TNodeType.Transform) {
    c = node.children;
  } else {
    c = node.children;
    context = { ...context, ...node.context };
  }

  let result = "";
  if (typeof c === "string") {
    result = c;
  } else if (typeof c === "number") {
    result = c.toString();
  } else if (typeof c === "object" && c !== null) {
    if (Array.isArray(c)) {
      result = renderNodeArray(c, context, stackTrace);
    } else {
      result = renderNode(c, context, stackTrace);
    }
  }

  if (node.type === TNodeType.Transform) {
    result = node.fn(result, context);
  }

  stackTrace.pop();
  return result;
}

/**
 * STACK_TRACE is a `Symbol` that is used as a key for a property to store stack traces in `Error` objects.
 */
export const STACK_TRACE = Symbol("StackTrace");

/**
 * renderToString renders node tree into a string.
 *
 * @param node Root node.
 * @returns Rendered string.
 */
export function renderToString(...children: TChildren[]): string {
  const stackTrace: TNode[] = [];
  try {
    return renderNodeArray(children, {}, stackTrace);
  } catch (e) {
    if (typeof e === "object" && e !== null) {
      Object.defineProperty(e, STACK_TRACE, { value: stackTrace, writable: false });
    }
    throw e;
  }
}
