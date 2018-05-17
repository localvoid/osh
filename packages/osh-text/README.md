# osh-text

General purpose text utilities utilities for [osh](https://github.com/localvoid/osh) library.

## Transformers

```ts
function trim(...children: TChildren[]): TransformNode;
function trimLeft(...children: TChildren[]): TransformNode;
function trimRight(...children: TChildren[]): TransformNode;
function toLowerCase(...children: TChildren[]): TransformNode;
function toUpperCase(...children: TChildren[]): TransformNode;
function capitalize(...children: TChildren[]): TransformNode;
function replace(searchValue: string | RegExp, replaceValue: string, ...children: TChildren[]): TransformNode;
```

- `trim()` trims whitespaces from a string.
- `trimLeft()` trims whitespaces at the start of a string.
- `trimRight()` trims whitespaces at the end of a string.
- `toLowerCase()` converts string to lower case.
- `toUpperCase()` converts string to upper case.
- `capitalize()` capitalizes first character of a string.
- `replace()` replaces `searchValue` with `replaceValue`.

### Helpers

```ts
function intersperse(array: TChildren[], separator: TChildren): TChildren[];
```

- `intersperse()` intersperses `separator` between elements of an `array`.
