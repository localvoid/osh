import { Context, ComponentNode, TChildren, component, context } from "osh";
export const SCOPE_FRAME = Symbol("ScopeFrame");

interface ScopeFrame {
  readonly parent: ScopeFrame | null;
  readonly type: symbol;
  readonly symbols: Map<any, string>;
  readonly reverse: Map<string, any>;
}

function hasReverseSymbol(frame: ScopeFrame, symbol: string): boolean {
  let f: ScopeFrame | null = frame;
  while (f !== null) {
    if (f.reverse.has(symbol)) {
      return true;
    }
    f = f.parent;
  }
  return false;
}

function defaultConflictResolver(symbol: string, i: number): string {
  if (i === 1) {
    return symbol;
  }
  return `${symbol}_${i}`;
}

export function getSymbol(ctx: Context, scopeType: symbol, key: any): string {
  let scopeFrame = ctx[SCOPE_FRAME];
  if (scopeFrame === void 0) {
    scopeFrame = null;
  }
  while (scopeFrame !== null) {
    if (scopeFrame.type === scopeType) {
      const s = scopeFrame.symbols.get(key);
      if (s !== void 0) {
        return s;
      }
    }
    scopeFrame = scopeFrame.parent;
  }

  throw new Error(`Unable to find symbol "${key}" in a "${scopeType.toString()}" scope`);
}

export interface SymbolDeclaration<T = any> {
  readonly key: T;
  readonly symbol: string;
}

export function declSymbol(key: any, symbol: string): SymbolDeclaration {
  return { key, symbol };
}

export interface ScopeProps {
  readonly type: symbol;
  readonly conflictResolver: (key: string, i: number) => string;
  readonly symbols: SymbolDeclaration[];
  readonly children: TChildren;
}

export function Scope(ctx: Context, props: ScopeProps): TChildren {
  let parentFrame = ctx[SCOPE_FRAME];
  if (parentFrame === void 0) {
    parentFrame = null;
  }
  const symbols = new Map<any, string>();
  const reverse = new Map<string, any>();
  for (const s of props.symbols) {
    let symbol = props.conflictResolver(s.symbol, 1);
    if (parentFrame !== null) {
      let i = 2;
      while (hasReverseSymbol(parentFrame, symbol)) {
        symbol = props.conflictResolver(symbol, i++);
      }
    }
    symbols.set(s.key, symbol);
    reverse.set(symbol, s.key);
  }

  return context(
    {
      [SCOPE_FRAME]: {
        parent: parentFrame,
        type: props.type,
        symbols,
        reverse,
      },
    },
    props.children,
  );
}

export function scope(
  props: {
    type: symbol,
    symbols: SymbolDeclaration[],
    conflictResolver?: (key: string, i: number) => string,
    children: TChildren,
  },
): ComponentNode<ScopeProps> {
  return component<ScopeProps>(
    Scope,
    {
      conflictResolver: defaultConflictResolver,
      ...props,
    },
  );
}
