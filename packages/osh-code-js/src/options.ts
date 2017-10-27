export interface JSCodeOptions {
  readonly lang: "es5" | "es2015" | "es2016" | "es2017" | "ts" | "flow";
  readonly target: "browser" | "node";
  readonly module: "commonjs" | "es2015";
  readonly removeComments: boolean;
}

export const JS_CODE_OPTIONS = Symbol("JSCodeOptions");

export const DEFAULT_OPTIONS: JSCodeOptions = {
  lang: "es2016",
  target: "browser",
  module: "es2015",
  removeComments: false,
};
