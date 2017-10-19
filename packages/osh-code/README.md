`osh-code` provides a set of basic components for generating program code.

## Language Presets

Language presets provide a default context variable for different programming languages.

### Javascript

```ts
import { jsCode, line, docComment } from "osh-code";

renderToString(jsCode(
  docComment(
    line("Doc comment"),
  ),
  line(`console.log("Hello Code");`),
));
```

Will produce:

```js
/**
 * Doc comment
 */
console.log("Hello Code");
```

### Go

```ts
import { goCode, line, docComment } from "osh-code";

renderToString(goCode(
  docComment(
    line("Doc comment"),
  ),
  line(`func main() {`),
  indent(line(`fmt.Printf("Hello Code")`)),
  line(`}`),
));
```

Will produce:

```go
// Doc comment
func main() {
    fmt.Printf("Hello Code")
}
```

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
