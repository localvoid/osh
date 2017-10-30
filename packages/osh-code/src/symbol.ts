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
  return symbol + i;
}

/**
 * getSymbol performs a search for a symbol associated with `key` in a scope with a `scopeType` type.
 *
 * @param ctx Current context.
 * @param scopeType Scope type.
 * @param key Symbol key.
 * @returns Symbol.
 */
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

  throw new Error(`Unable to find symbol "${key}" in a "${scopeType.toString()}" scope.`);
}

/**
 * Sym is a component that performs a search for a symbol.
 *
 * @param ctx Current context.
 * @param props Properties.
 * @returns Symbol.
 */
export function Sym(ctx: Context, props: { scopeType: symbol, key: any }): TChildren {
  return getSymbol(ctx, props.scopeType, props.key);
}

/**
 * sym is a factory for a `Sym` component.
 *
 * `Sym` component performs a search for a symbol associated with `key` in a scope with a `scopeType` type.
 *
 * @param scopeType Scope type.
 * @param key Symbol key.
 * @returns `Sym` component node.
 */
export function sym(scopeType: symbol, key: any): ComponentNode<{ scopeType: symbol, key: any }> {
  return component(Sym, { scopeType, key });
}

/**
 * SymbolDeclaration is an object that contains a symbol key associated with a symbol.
 */
export interface SymbolDeclaration<T = any> {
  /**
   * Symbol key.
   */
  readonly key: T;
  /**
   * Symbol.
   */
  readonly symbol: string;
}

/**
 * declSymbol creates `SymbolDeclaration` object.
 *
 * `SymbolDeclaration` is an object that contains a symbol key associated with a symbol.
 *
 * @param key Symbol key.
 * @param symbol Symbol.
 * @returns Symbol declaration.
 */
export function declSymbol(key: any, symbol: string): SymbolDeclaration {
  return { key, symbol };
}

/**
 * ScopeProps object contains properties for a `Scope` component.
 */
export interface ScopeProps {
  /**
   * Scope type.
   */
  readonly type: symbol;
  /**
   * Conflict resolver.
   */
  readonly conflictResolver: (key: string, i: number) => string;
  /**
   * Symbol declarations.
   */
  readonly symbols: SymbolDeclaration[];
  /**
   * Children nodes.
   */
  readonly children: TChildren;
}

/**
 * Scope is a component that stores symbol declarations and automatically resolves conflicting symbol names.
 *
 * @param ctx Current context.
 * @param props Scope properties.
 * @returns Children nodes wrapped in a scope.
 */
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

/**
 * scope is a factory for `Scope` component.
 *
 * `Scope` is a component that stores symbol declarations and automatically resolves conflicting symbol names.
 *
 * @param props Scope properties.
 */
export function scope(props: ScopeProps): ComponentNode<ScopeProps> {
  return component<ScopeProps>(
    Scope,
    {
      conflictResolver: defaultConflictResolver,
      ...props,
    },
  );
}
