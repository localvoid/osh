`osh-code-go` provides a set of basic components for generating Go program code.

## Language Preset

```ts
import { renderToString } from "osh";
import { line, docComment } from "osh-code";
import { goCode } from "osh-code-go";

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
