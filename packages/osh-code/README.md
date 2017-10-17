`osh-code` provides a set of basic components for generating program code.

## Components

### Line

```ts
function line(...children: TChildren[]);
```

### Increase Indentation level

```ts
function indent(...children: TChildren[]);
```

### Commented text

```ts
function comment(text: string);
```

## Context Symbols

- `INDENT_LEVEL` current indentation level
- `INDENT_STRING` string that is used for indentation
- `COMMENT_CONFIG` configuration for comments generation
- `INLINE` rendering text inside of a line
