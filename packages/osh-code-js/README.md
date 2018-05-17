# osh-code-js

`osh-code-js` provides a set of basic components for generating Javascript(TypeScript) program code.

## `osh-code` preset

```ts
interface JSCodeOptions {
  readonly lang: "es5" | "es2015" | "es2016" | "es2017" | "ts" | "flow";
  readonly target: "browser" | "node";
  readonly module: "commonjs" | "es2015";
  readonly removeComments: boolean;
}

function jsCode(options: Partial<JSCodeOptions> | undefined, children: TChildren): ComponentNode<JSCodeProps>;
```

```ts
import { renderToString } from "osh";
import { line, docComment } from "osh-code";
import { jsCode } from "osh-code-js";

renderToString(jsCode(
  { lang: "es2016" },
  [
    docComment(
      line("Doc comment"),
    ),
    line(`console.log("Hello Javascript");`),
  ],
));
```
