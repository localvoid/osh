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

function lookupSymbol(frame: ScopeFrame, scopeType: symbol, key: any): string | undefined {
  let f: ScopeFrame | null = frame;
  while (f !== null) {
    if (f.type === scopeType) {
      const s = f.symbols.get(key);
      if (s !== void 0) {
        return s;
      }
    }
    f = f.parent;
  }
  return undefined;
}

export function getSymbol(ctx: Context, scopeType: symbol, key: any): string {
  const scopeFrame = ctx[SCOPE_FRAME];
  if (scopeFrame !== void 0) {
    const s = lookupSymbol(scopeFrame, scopeType, key);
    if (s !== void 0) {
      return s;
    }
  }

  throw new Error(`Unable to find symbol "${key}" in a "${scopeType.toString()}" scope`);
}

export interface SymbolDeclaration {
  readonly key: any;
  readonly symbol: string;
}

export function declSymbol(key: any, symbol: string): SymbolDeclaration {
  return { key, symbol };
}

export interface ScopeProps {
  readonly scopeType: symbol;
  readonly conflictResolver: (key: string, i: number) => string;
  readonly symbols: any;
  readonly children: TChildren[];
}

export function Scope(ctx: Context, props: ScopeProps): TChildren {
  let parentFrame = ctx[SCOPE_FRAME];
  if (parentFrame === void 0) {
    parentFrame = null;
  }
  const symbols = new Map<any, string>();
  const reverse = new Map<string, any>();
  for (const s of props.symbols) {
    let symbol = props.conflictResolver(s.symbol, 0);
    if (parentFrame !== null) {
      let i = 1;
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
        type: props.scopeType,
        symbols,
        reverse,
      },
    },
    props.children,
  );
}

export function scope(
  scopeType: symbol,
  conflictResolver: (key: string, i: number) => string,
  symbols: SymbolDeclaration[],
  ...children: TChildren[],
): ComponentNode<ScopeProps> {
  return component<ScopeProps>(Scope, { scopeType, conflictResolver, symbols, children });
}
