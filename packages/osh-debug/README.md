Debug utilities for [osh](https://github.com/localvoid/osh) library.

## Stack Traces

```ts
function stackTraceToString(stackTrace: TNode[]): string;
```

`stackTraceToString` converts stack trace to a readable string.

```ts
function extractContext(stackTrace: TNode[]): Context;
```

`extractContext` extracts the latest context from stack trace.
