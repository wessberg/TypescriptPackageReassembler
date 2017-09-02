import {Expression, Node, NodeArray, SourceFile, Statement} from "typescript";
import {ITransformUtil, TransformEachTransformer} from "./i-transform-util";

/**
 * A utility class that helps with transformation-related tasks
 */
export class TransformUtil implements ITransformUtil {
	/**
	 * Transforms each of the provided statements, updating SourceFiles underway to continuously update the SourceFile
	 * @param {TransformEachTransformer} transformer
	 * @param {NodeArray<Statement | Expression | Node>|SourceFile} compiledStatements
	 * @param {NodeArray<Statement | Expression | Node>|SourceFile} declarationStatements
	 * @returns {SourceFile}
	 */
	public transformEach<T extends (Statement|Expression|Node), U extends (Statement|Expression|Node)> (transformer: TransformEachTransformer<T, U>, compiledStatements: NodeArray<T>|SourceFile, declarationStatements: NodeArray<U>|SourceFile): SourceFile {
		const normalizedDeclarationStatements = this.getStatements(declarationStatements);
		let normalizedCompiledStatements = this.getStatements(compiledStatements);
		const length = normalizedCompiledStatements.length;
		let cursor = 0;
		let sourceFile: SourceFile = this.getSourceFile(normalizedCompiledStatements);

		while (cursor < length) {
			const compiled = normalizedCompiledStatements[cursor];
			const declaration = normalizedDeclarationStatements[cursor];
			sourceFile = transformer(<T>compiled, <U>declaration);
			console.log("sourceFile:", sourceFile);
			normalizedCompiledStatements = this.getStatements(sourceFile);
			cursor++;
		}
		return sourceFile;
	}

	/**
	 * Returns the statements of a SourceFile or the statements themselves if that is what is provided as an argument
	 * @param {NodeArray<Statement> | SourceFile} statements
	 * @returns {NodeArray<Statement|Expression|Node>}
	 */
	public getStatements (statements: NodeArray<Statement|Expression|Node>|SourceFile): NodeArray<Statement|Expression|Node> {
		return Array.isArray(statements) ? statements : (<SourceFile>statements).statements;
	}

	/**
	 * Returns the first matched SourceFile of the given statements or the SourceFile itself if that is what is provided as an argument
	 * @param {NodeArray<Statement> | SourceFile} statements
	 * @returns {SourceFile}
	 */
	public getSourceFile (statements: NodeArray<Statement|Expression|Node>|SourceFile): SourceFile {
		return this.getStatements(statements)[0].getSourceFile();
	}

}