import { Context } from "./context";
import { TNodeType, TNode, TChildrenArray } from "./tnode";

function renderNodeList(nodes: TChildrenArray, context: Context): string {
  let r = "";
  for (const node of nodes) {
    if (typeof node === "object") {
      if (node !== null) {
        if (Array.isArray(node)) {
          r += renderNodeList(node, context);
        } else {
          r += _renderToString(node, context);
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

function _renderToString(node: TNode, context: Context): string {
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
      result = renderNodeList(c, context);
    } else {
      result = _renderToString(c, context);
    }
  }

  if (node.type === TNodeType.Transform) {
    result = node.fn(result, context);
  }

  return result;
}

export function renderToString(node: TNode): string {
  return _renderToString(node, {});
}
