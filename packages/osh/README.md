`osh` is a javascript library that provides component-based model for generating text data.

One of the primary use case for this library is creating program code emitters.

## Example

```ts
import { renderToString } from "osh";
import { line, indent, docComment } from "osh-code";
import { jsCode } from "osh-code-js";

renderToString(jsCode(
  docComment(
    line("Doc comment"),
  ),
  line(`function Main() {`),
  indent(line(`console.log("Hello Code");`)),
  line(`}`),
));
```

Will produce:

```js
/**
 * Doc comment
 */
function Main() {
  console.log("Hello Code");
}
```

## Getting Started

`osh` API is super simple, it has three building blocks: `Component`, `Context` and `Transform`

### Components

Components are declared with a simple functions that has two optional parameters `ctx` and `props`.

```js
function Component(ctx, props) {
  return "text";
}
```

Component nodes are created with `component` function:

```ts
function component(fn: () => TChildren): ComponentNode<undefined>;
function component(fn: (context: Context) => TChildren): ComponentNode<undefined>;
function component<T>(fn: (context: Context, props: T) => TChildren, props: T): ComponentNode<T>;
function component(fn: (context: Context, props: any) => TChildren, props?: any): ComponentNode<any>;
```

#### Example

```js
import { componentFactory, component, renderToString } from "osh";
import { line, indent } from "osh-code";

const indentedComponent = componentFactory((msg) => indent(line("Indented Text: ", msg)));

function Example(ctx, msg) {
  return [
    line("Example"),
    indentedComponent(msg),
  ];
}

console.log(renderToString(component(Example, "Hello")));
```

### Context

Context is an immutable object that propagates contextual data to components.

Context nodes are created with `context` factory function:

```ts
function context(ctx: Context, children: TChildren): ContextNode;
```

#### Example

```js
import { component, context, renderToString } from "osh";

// Unique symbol to prevent name collisions
const VARS = Symbol("Vars");

// Def component will assign variables to the current context
function Def(ctx, props) {
  return context(
    { [VARS]: { ...ctx[VARS], ...{ props.vars } } },
    props.children,
  );
}

function def(vars, ...children) {
  return component(Def, { vars, children });
}

// v component will extract variable from the current context
const v = componentFactory((ctx, name) => ctx[VARS][name]);

function Example(ctx, msg) {
  return line("Var: ", v("var"))];
}

console.log(
  renderToString(
    def(
      { "var": "Hello" },
      component(Example),
    ),
  ),
);
```

### Transform

Transform components perform transformations on rendered strings.

```ts
function transform(fn: (s: string) => string): TransformNode;
function transform(fn: (s: string, context: Context) => string, ...children: TChildren[]): TransformNode;
```

## Additional Packages

- [osh-code](https://npmjs.com/package/osh-code) provides a basic set of components for generating program code.
- [osh-code-go](https://npmjs.com/package/osh-code-go) provides a basic set of components for generating Go program
code.
- [osh-code-js](https://npmjs.com/package/osh-code-js) provides a basic set of components for generating
Javascript(TypeScript) program code.
