import {SourceFile} from "typescript";

export interface ITypescriptPackageReassembleResult {
	sourceFile: SourceFile;
	content: string;
}