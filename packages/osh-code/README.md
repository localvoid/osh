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
function blockComment(...children: TChildren[]);
function docComment(...children: TChildren[]);
```

## Context Symbols

- `INDENT_LEVEL` current indentation level
- `INDENT_STRING` string that is used for indentation
- `PADDING` string padding for a line
- `LINE` rendering inside of a line
- `COMMENT_CONFIG` configuration for comments generation
- `BLOCK_COMMENT` rendering inside of a block comment
