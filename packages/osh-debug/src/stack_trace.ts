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

/**
 * stackTraceToString converts stack trace to pretty printed string.
 *
 * @param stackTrace Stack trace.
 * @returns Pretty printed stack trace.
 */
export function stackTraceToString(stackTrace: TNode[]): string {
  let s = "";

  for (const stackFrame of stackTrace) {
    switch (stackFrame.type) {
      case TNodeType.Component:
        s += `[c] ${functionName(stackFrame.fn)}\n`;
        break;
      case TNodeType.Transform:
        s += `[t] ${functionName(stackFrame.fn)}\n`;
        break;
    }
  }

  return s;
}

/**
 * extractContext extracts context object from the stack trace.
 *
 * @param stackTrace Stack trace.
 * @returns Context object.
 */
export function extractContext(stackTrace: TNode[]): Context {
  let context = {};
  for (const frame of stackTrace) {
    if (frame.type === TNodeType.Context) {
      context = Object.assign(context, frame.context);
    }
  }
  return context;
}
