import { Context, TNodeType, TNode } from "osh";

interface FunctionWithDisplayName extends Function {
  displayName?: string;
}

function functionName(fn: FunctionWithDisplayName): string {
  if (fn.displayName) {
    return fn.displayName;
  }
  return fn.name;
}

export function stackTraceToString(stackTrace: TNode[]): string {
  let s = "";

  for (const stackFrame of stackTrace) {
    switch (stackFrame.type) {
      case TNodeType.Component:
        s += `[c] ${functionName(stackFrame.fn)}\n`;
        break;
      case TNodeType.Transform:
        s += `[t] ${functionName(stackFrame.fn)}`;
        break;
    }
  }

  return s;
}

export function extractContext(stackTrace: TNode[]): Context {
  let i = stackTrace.length - 1;
  let context = {};
  while (i-- > 0) {
    const frame = stackTrace[i];
    if (frame.type === TNodeType.Context) {
      context = Object.assign(context, frame.context);
    }
  }
  return context;
}
