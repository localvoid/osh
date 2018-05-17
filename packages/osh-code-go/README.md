# osh-code-go

`osh-code-go` provides a set of basic components for generating Go program code.

## `osh-code` preset

```ts
interface GOCodeOptions {
  readonly removeComments: boolean;
}
function goCode(options: Partial<GOCodeOptions> | undefined, children: TChildren): ComponentNode<GOCodeProps>;
```

```ts
import { renderToString } from "osh";
import { line, docComment } from "osh-code";
import { goCode } from "osh-code-go";

renderToString(goCode(
  undefined,
  [
    docComment(
      line("Doc comment"),
    ),
    line(`func main() {`),
    indent(line(`fmt.Printf("Hello Go")`)),
    line(`}`),
  ],
));
```
