import {Node, NodeArray, SourceFile} from "typescript";

export interface ITypescriptPackageReassemblerOptions {
	declarationStatements: NodeArray<Node>|SourceFile;
	compiledStatements: NodeArray<Node>|SourceFile;
}