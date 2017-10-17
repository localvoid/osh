import { Context } from "./context";
import { TNodeType, TNode, TNodeList } from "./tnode";

function renderNodeList(nodes: TNodeList, context: Context): string {
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
  } else {
    c = node.children;
    context = { ...context, ...node.context };
  }

  if (typeof c === "string") {
    return c;
  }
  if (typeof c === "number") {
    return c.toString();
  }
  if (typeof c === "object" && c !== null) {
    if (Array.isArray(c)) {
      return renderNodeList(c, context);
    }
    return _renderToString(c, context);
  }
  return "";
}

export function renderToString(node: TNode): string {
  return _renderToString(node, {});
}
