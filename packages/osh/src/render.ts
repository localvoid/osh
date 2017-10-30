import { Context } from "./context";
import { TNodeType, TNode, TChildrenArray } from "./tnode";

function renderNodeList(nodes: TChildrenArray, context: Context, stackTrace: TNode[]): string {
  let r = "";
  for (const node of nodes) {
    if (typeof node === "object") {
      if (node !== null) {
        if (Array.isArray(node)) {
          r += renderNodeList(node, context, stackTrace);
        } else {
          r += _renderToString(node, context, stackTrace);
        }
      }
    } else if (typeof node === "string") {
      r += node;
    } else if (typeof node === "number") {
      r += node.toString();
    }
  }
  return r;
}

function _renderToString(node: TNode, context: Context, stackTrace: TNode[]): string {
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
      result = renderNodeList(c, context, stackTrace);
    } else {
      result = _renderToString(c, context, stackTrace);
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
export function renderToString(node: TNode): string {
  const stackTrace: TNode[] = [];
  try {
    return _renderToString(node, {}, stackTrace);
  } catch (e) {
    if (typeof e === "object" && e !== null) {
      Object.defineProperty(e, STACK_TRACE, { value: stackTrace, writable: false });
    }
    throw e;
  }
}
