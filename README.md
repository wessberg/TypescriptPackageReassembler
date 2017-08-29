# TypescriptPackageReassembler
[![NPM version][npm-version-image]][npm-version-url]
[![License-mit][license-mit-image]][license-mit-url]

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg

[npm-version-url]: https://www.npmjs.com/package/@wessberg/typescript-package-reassembler

[npm-version-image]: https://badge.fury.io/js/%40wessberg%2Ftypescript-package-reassembler.svg

> A library that can (re)add type information from a Typescript SourceFile to another. Useful for 'merging' declarations with compiled un-typed files, for example inside node_modules

## Installation
Simply do: `npm install @wessberg/typescript-package-reassembler`.

## What is it

A library that can (re)add type information from a Typescript SourceFile to another. Useful for 'merging' declarations with compiled un-typed files.
The most probable use case (and the one this was built primarily for) is if you want to parse code from a library inside node_modules and want Typescript's AST to use the
type-information from the declaration file (*".d.ts"*) that exists within the same directory.

## Disclaimer

This is very much in alpha. I don't assume any issues, however.

## Usage
```typescript
// Generate a Typescript AST for the compiled code somehow
const compiledStatements = someTypescriptLanguageService.addFile("/path_to_file.js");
// // Generate a Typescript AST for the declaration file somehow
const declarationStatements = someTypescriptLanguageService.addFile("/path_to_file.d.ts");

const reassembler = new TypescriptPackageReassembler();

// Get the new SourceFile. Content is the new string representation of the file. It will look like the compiled one, except it will include the type information from the declaration statements
const {content, sourceFile} = reassembler.reassemble({compiledStatements, declarationStatements});
```