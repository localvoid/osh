# osh-code

`osh-code` provides a set of basic components for generating program code.

## Components

### Lines

```ts
function line(...children: TChildren[]);
function indent(...children: TChildren[]);
```

#### Example

```ts
// 1. Line
//   2. Indented line
// 3. Line
renderToString(jsCode({ lang: "es2016" },
  [
    line("1. Line"),
    indent(
      line("2. Indented line"),
    ),
    line("3. Line"),
  ],
);
```

### Comments

```ts
function comment(...children: TChildren[]);
function blockComment(...children: TChildren[]);
function docComment(...children: TChildren[]);
```

#### Example

```ts
// /* inline comment */
renderToString(jsCode({ lang: "es2016" }, comment("inline comment")));

// /*
//  * block comment
//  */
renderToString(jsCode({ lang: "es2016" },
  blockComment(
    line("block comment"),
  ),
));

// /**
//  * doc comment
//  */
renderToString(jsCode({ lang: "es2016" },
  docComment(
    line("doc comment"),
  ),
));
```

### Symbol Scopes

```ts
function scope(
  props: {
    type: symbol;
    conflictResolver?: (key: string, i: number) => string;
    symbols: SymbolDeclaration[];
    children: TChildren;
  },
): ComponentNode<ScopeProps>;

function declSymbol(key: any, symbol: string): SymbolDeclaration;
function getSymbol(ctx: Context, scopeType: symbol, key: any): string {
function sym(scopeType: symbol, key: any): ComponentNode<{ scopeType: symbol, key: any }>;
```

## Context Symbols

- `INDENT_LEVEL` indentation level.
- `INDENT_STRING` string that is used for indentating lines.
- `PADDING` line padding.
- `LINE` rendering inside of a line.
- `COMMENT_CONFIG` comment config.
- `BLOCK_COMMENT` block comment type.
