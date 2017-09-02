import {Expression, Node, NodeArray, SourceFile, Statement} from "typescript";

export declare type TransformEachTransformer<T, U> = (compiled: T, declaration: U) => SourceFile;

export interface ITransformUtil {
	transformEach <T extends (Statement|Expression|Node), U extends (Statement|Expression|Node)> (transformer: TransformEachTransformer<T, U>, compiledStatements: NodeArray<T>|SourceFile, declarationStatements: NodeArray<U>|SourceFile): SourceFile;
	getStatements (statements: NodeArray<Statement|Expression|Node>|SourceFile): NodeArray<Statement|Expression|Node>;
	getSourceFile (statements: NodeArray<Statement|Expression|Node>|SourceFile): SourceFile;
}