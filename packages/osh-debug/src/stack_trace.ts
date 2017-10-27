import { TNodeType, TNode } from "osh";

export function stackTraceToString(stackTrace: TNode[]): string {
  let s = "";

  for (const stackFrame of stackTrace) {
    switch (stackFrame.type) {
      case TNodeType.Component:
        s += `[c] ${stackFrame.fn.name}\n`;
        break;
      case TNodeType.Transform:
        s += `[t] ${stackFrame.fn.name}`;
        break;
    }
  }

  return s;
}
