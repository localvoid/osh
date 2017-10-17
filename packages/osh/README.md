`osh` is a javascript library that provides component-based model for generating text data.

### Components

Component is a basic building block for generating text data.

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

// def component will assign variables to the current context
const def = componentFactory((ctx, props) => {
  return context(
    { [VARS]: { ...ctx[VARS], ...{ props.vars } } },
    props.children,
  );
});

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

## Additional Packages

- [osh-code](https://npmjs.com/package/osh-code) provides a basic set of components for generating program code.

