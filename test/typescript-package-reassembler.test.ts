import {test} from "ava";
import {TypescriptLanguageService} from "@wessberg/typescript-language-service";
import {FileLoader} from "@wessberg/fileloader";
import {ModuleUtil} from "@wessberg/moduleutil";
import {PathUtil} from "@wessberg/pathutil";
import {TypescriptPackageReassembler} from "../src/typescript-package-reassembler/typescript-package-reassembler";

const reassembler = new TypescriptPackageReassembler();
const fileLoader = new FileLoader();
const pathUtil = new PathUtil(fileLoader);
const moduleUtil = new ModuleUtil(fileLoader, pathUtil);
const languageService = new TypescriptLanguageService(moduleUtil, pathUtil, fileLoader, reassembler);

test("foo", t => {
	const compiledStatements = languageService.addFile({path: "./test/static/foo.js"});
	const declarationStatements = languageService.addFile({path: "./test/static/foo.d.ts"});

	const result = reassembler.reassemble({compiledStatements, declarationStatements});
	console.log(result.content);
	t.true(result != null);
});