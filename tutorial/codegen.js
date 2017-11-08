import * as fs from "fs";
import { context, capitalize, renderToString } from "osh";
import { intersperse } from "osh-text";
import { PADDING, line, indent, scope, declSymbol, sym } from "osh-code";
import { jsCode } from "osh-code-js";
import { createDirectiveMatcher, inject } from "incode";
import { USER_SCHEMA } from "./schema";

const FILE = "./code.js";

const SCHEMAS = {
  user: USER_SCHEMA,
};

const ARGUMENTS = Symbol("Arguments");
const LOCAL_VARS = Symbol("LocalVars");

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
            intersperse(
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
    const args = region.args;
    if (args[0] === "validate") {
      const name = args[1];
      const schema = SCHEMAS[name];
      // emit API is changed and has a `padding` as a first argument that should be prepended for all lines.
      // `region.padding` is automatically detected by `incode` library.
      return emit(region.padding, validateFunction(name, schema));
    }

    throw new Error(`Invalid region type: ${region.type}.`);
  },
);

fs.writeFileSync(result);
