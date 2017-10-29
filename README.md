`osh` is a javascript library that provides component-based model for generating text data.

## Tutorial

In this tutorial we will create a code generator that generates type validation functions from simple schemas like this:

```js
const USER_SCHEMA = {
  id: "number",
  name: "string",
};
```

`USER_SCHEMA` is a schema that defines expected types for object properties. With this schema, we would like to
generate validation function that look like this:

```js
function validateUser(user) {
  let errors;
  let type;

  type = typeof user.id;
  if (type !== "number") {
    if (errors === undefined) {
      errors = [];
    }
    errors.push({ prop: "id", type: type });
  }

  type = typeof user.name;
  if (type !== "string") {
    if (errors === undefined) {
      errors = [];
    }
    errors.push({ prop: "name", type: type });
  }

  return errors;
}
```

Full source for this tutorial is available [here](https://github.com/localvoid/osh/tree/master/tutorial).

### Install dependencies

To build codegenerator we will use four packages:

- [osh](https://npmjs.com/package/osh) package provides basic building blocks for text generation and a string renderer.
- [osh-code](https://npmjs.com/package/osh-code) package provides generic components that can be used in many different
programming languages (`line()`, `indent()`, `comment()` etc).
- [osh-code-js](https://npmjs.com/package/osh-code-js) package provides javascript specific components and a preset that
sets up `osh-code` environment.
- [incode](https://npmjs.com/package/incode) package will be used for injecting generated code.

```sh
$ npm i --save osh osh-code osh-code-js incode
```

### Set up environment

First thing that we need to do is set up `osh-code` environment for javascript code generation.
[osh-code-js](https://npmjs.com/package/osh-code-js) provides a configurable `jsCode` preset that sets up codegen
environment for javascript.

```js
import { renderToString } from "osh";
import { jsCode } from "osh-code-js";

function emit(...children) {
  return renderToString(
    jsCode(
      {
        lang: "es2016",
      },
      children,
    ),
  );
}
```

`emit` function will take any `osh` nodes and render them inside a javascript codegen environment.

### Function declaration

Let's start from generating a function declaration for our validate function:

```js
function validateUser() {
  return;
}
```

To generate this declaration we will use three different components: `capitalize`, `line` and `indent`.

`line(...children)` and `indent(...children)` are basic components and `capitalize(...children)` is a transformer. The
main difference between components and transformers is that transformers perform transformation step on a final
string, and components are producing another components and strings.

`indent(...children)` component increases indentation level.

`line(...children)` component wraps children into a line.

`capitalize(...children)` transformer converts first character to uppercase.

```js
import { capitalize } from "osh";
import { line, indent } from "osh-code";

function validateFunction(name, schema) {
  return [
    line("function validate", capitalize(name), "() {"),
    indent(
      line("return;"),
    ),
    line("}"),
  ];
}
```

### Function arguments

One of the most common problems when automatically generating code is preventing name collisions for symbols.

`osh-code` package has a `scope` component that solves this problem. With `scope` component we can define symbols with
automatic conflict resolution for colliding symbol names. `jsCode()` environment automatically registers all reserved
keywords as scope symbols, so symbols like `for` will be automatically renamed to prevent invalid javascript code
generation.

When defining a scope, there are three mandatory properties: `type`, `symbols` and `children`.

- `type` is a scope type, it is used for symbol lookups when there are different symbols associated with the same key.
- `symbols` is an array of symbols, all symbols should be created with `declSymbol(key, symbol)` factory.
- `children` is an array of `osh` nodes.

There are two ways to retrieve symbols from the current scope:

`getSymbol(context, type, key)` is a low-level function that retrieves symbol from the context provided as a first
argument.

`sym(type, key)` is a component that will retrieve symbol from the current context.

```js
import { scope, declSymbol, sym } from "osh-code";

const ARGUMENTS = Symbol("Arguments");

function arg(name) {
  return sym(ARGUMENTS, name);
}

function declArg(arg, children) {
  return scope({
    type: ARGUMENTS,
    symbols: [declSymbol("data", arg)],
    children: children,
  });
}

function validateFunction(name, schema) {
  return (
    declArg(
      name,
      [
        line("function validate", capitalize(name), "(", arg("data"), ") {"),
        indent(
          line("return;"),
        ),
        line("}"),
      ],
    )
  );
}
```

Here we defined two functions: `arg()` and `declArg()`. `arg()` is a helper function that will retrieve symbols from
scopes with `ARGUMENTS` type. And `declArg()` will declare a `name` symbol with `"data"` key.

### Local variables

In our validation function we are using two local variables: `errors` and `type`, so we should create another `scope`
and declare this variables.

```js
const LOCAL_VARS = Symbol("LocalVars");

function lvar(name) {
  return sym(LOCAL_VARS, name);
}

function declVars(vars, children) {
  return scope({
    type: LOCAL_VARS,
    symbols: vars.map((name) => declSymbol(name, name)),
    children: children,
  });
}

function validateFunction(name, schema) {
  return (
    declArg(
      name,
      declVars(
        ["errors", "type"],
        [
          line("function validate", capitalize(name), "(", arg("data"), ") {"),
          indent(
            line("let ", lvar("errors"), ";"),
            line("let ", lvar("type"), ";"),
            line(),
            line("return ", lvar("errors"), ";"),
          ),
          line("}"),
        ],
      ),
    )
  );
}
```

### Generating type checking code

Now we just need to generate type checking code for all fields.

```js
import { join } from "osh";

function checkType(prop, type) {
  return [
    line(lvar("type"), " = typeof ", arg("data"), ".", prop),
    line("if (", lvar("type"), " !== \"", type, "\") {"),
    indent(
      line("if (", lvar("errors"), " === undefined) {"),
      indent(
        line(lvar("errors"), " = [];"),
      ),
      line("}"),
    ),
    line("}"),
  ];
}

function validateFunction(name, schema) {
  return (
    declArg(
      name,
      declVars(
        ["errors", "type"],
        [
          line("function validate", capitalize(name), "(", arg("data"), ") {"),
          indent(
            line("let ", lvar("errors"), ";"),
            line("let ", lvar("type"), ";"),
            line(),
            join(
              Object.keys(schema).map((prop) => checkType(prop, schema[prop])),
              line(),
            ),
            line(),
            line("return ", lvar("errors"), ";"),
          ),
          line("}"),
        ],
      ),
    )
  );
}
```

### Injecting generated code into existing code

And the final step is to inject generated code into existing code. To inject generated code we will use `incode`
package, it is using different directives for defining injectable regions:

- `chk:assign({ ... })` assigns a data in `JSON` format to the current scope.
- `chk:emit(type)` injects a code block into the region

```js
// chk:assign({ "schema": "user" })
// chk:emit("validate")
// chk:end

function getUser() {
  const user = fetchUser();
  const errors = validateUser(user);
  if (errors !== undefined) {
    throw new Error("Invalid user");
  }
  return user;
}
```

`incode` automatically detects line paddings for injectable regions, and we would like to use this information to indent
our generated code. To do this, we will need to change our `emit()` function and assign a padding value to a `PADDING`
symbol in the context.

```js
import * as fs from "fs";
import { context } from "osh";
import { PADDING } from "osh-code";
import { createDirectiveMatcher, inject } from "incode";
import { USER_SCHEMA } from "./schema";

const FILE = "./code.js";

const SCHEMAS = {
  user: USER_SCHEMA,
};

function emit(padding, ...children) {
  return renderToString(
    context(
      {
        [PADDING]: padding === undefined ? "" : padding,
      },
      jsCode(
        {
          lang: "es2016",
        },
        children,
      ),
    ),
  );
}

const result = inject(
  fs.readFileSync(FILE).toString(),
  createDirectiveMatcher("chk"),
  (region) => {
    if (region.type === "validate") {
      const name = region.data.schema;
      const schema = SCHEMAS[name];
      // emit API is changed and has a `padding` as a first argument that should be prepended for all lines.
      // `region.padding` is automatically detected by `incode` library.
      return emit(region.padding, validateFunction(name, schema));
    }

    throw new Error(`Invalid region type: ${region.type}.`);
  },
);

fs.writeFileSync(FILE, result);
```

## API
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
- [osh-debug](https://npmjs.com/package/osh-debug) debug utilities.
