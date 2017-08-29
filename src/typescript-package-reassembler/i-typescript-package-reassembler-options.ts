import {NodeArray, Statement, SourceFile} from "typescript";

export interface ITypescriptPackageReassemblerOptions {
	declarationStatements: NodeArray<Statement>|SourceFile;
	compiledStatements: NodeArray<Statement>|SourceFile;
}