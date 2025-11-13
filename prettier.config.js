/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    trailingComma: "es5",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    bracketSpacing: true,
    printWidth: 80,
    arrowParens: "always",
    endOfLine: "lf",
    useTabs: false,
    proseWrap: "preserve",
    quoteProps: "as-needed",
    htmlWhitespaceSensitivity: "css",
    bracketSameLine: false,
    experimentalOperatorPosition: "start",
    experimentalTernaries: true,
    objectWrap: "preserve",
};

export default config;
