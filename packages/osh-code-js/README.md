`osh-code-js` provides a set of basic components for generating Javascript(TypeScript) program code.

## Language Presets

Language presets provide a default context variable for different programming languages.

### Javascript

```ts
import { renderToString } from "osh";
import { line, docComment } from "osh-code";
import { jsCode } from "osh-code-js";

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
