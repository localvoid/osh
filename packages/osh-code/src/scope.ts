import { Context, ComponentNode, TChildren, component, context, transform } from "osh";
export const SCOPES = Symbol("Scopes");

const has = Object.prototype.hasOwnProperty;

export function get(scopeName: symbol, ...children: TChildren[]): TChildren {
  return transform(
    (sym, ctx) => {
      const scopes = ctx[SCOPES];
      if (scopes !== void 0) {
        const s = scopes[scopeName];
        if (s !== void 0) {
          if (has.call(s, sym)) {
            return s[sym];
          }
        }
      }

      throw new Error(`Unable to find symbol "${sym}" in a "${scopeName}" scope`);
    },
    children,
  );
}

export interface ScopeProps {
  readonly scopeName: symbol;
  readonly conflictResolver: (key: string, i: number) => string;
  readonly keys: string[];
  readonly children: TChildren[];
}

function keysToObj(keys: string[]): {} {
  const r: any = {};
  for (const key of keys) {
    r[key] = key;
  }
  return r;
}

export function Scope(ctx: Context, props: ScopeProps): TChildren {
  let scopes = ctx[SCOPES];
  if (scopes === void 0) {
    scopes = { [props.scopeName]: keysToObj(props.keys) };
  } else {
    let s = scopes[props.scopeName];
    if (s === void 0) {
      s = keysToObj(props.keys);
    } else {
      s = { ...s };
      for (const key of props.keys) {
        let alias = key;
        let i = 0;
        while (has.call(s, key)) {
          alias = props.conflictResolver(key, i++);
        }
        s[key] = alias;
      }
    }
    scopes = { ...scopes, ...{ [props.scopeName]: s } };
  }

  return context({ [SCOPES]: scopes }, props.children);
}

export function scope(
  scopeName: symbol,
  conflictResolver: (key: string, i: number) => string,
  keys: string[],
  ...children: TChildren[],
): ComponentNode<ScopeProps> {
  return component<ScopeProps>(Scope, { scopeName, conflictResolver, keys, children });
}
