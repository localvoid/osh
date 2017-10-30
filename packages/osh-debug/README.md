Debug utilities for [osh](https://github.com/localvoid/osh) library.

## Stack Traces

```ts
function stackTraceToString(stackTrace: TNode[]): string;
function extractContext(stackTrace: TNode[]): Context;
```

`stackTraceToString()` converts stack trace to pretty printed string.

`extractContext()` extracts context object from the stack trace.
