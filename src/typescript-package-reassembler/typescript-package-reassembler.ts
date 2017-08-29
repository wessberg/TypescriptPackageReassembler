import {Expression, Node, Statement, createPrinter, SourceFile, NodeArray} from "typescript";
import {ITypescriptPackageReassembler} from "./i-typescript-package-reassembler";
import {ITypescriptPackageReassemblerOptions} from "./i-typescript-package-reassembler-options";
import {ITypescriptPackageReassembleResult} from "./i-typescript-package-reassemble-result";
import {IMatcher} from "../matcher/i-matcher";
import {IReassembler} from "../reassembler/i-reassembler";
import {Matcher} from "../matcher/matcher";
import {Reassembler} from "../reassembler/reassembler";

/**
 * A class that can add type information from the provided declarations statements to the provided compiled statements.
 * This is meant for "merging" a declaration file (.d.ts) with a compiled source file (.js)
 */
export class TypescriptPackageReassembler implements ITypescriptPackageReassembler {
	/**
	 * The matcher will figure out which expressions fits which statements
	 * @type {Matcher}
	 */
	private readonly matcher: IMatcher = new Matcher();

	/**
	 * The reassembler will set type information on the statements of the compiled code
	 * @type {Reassembler}
	 */
	private readonly reassembler: IReassembler = new Reassembler();

	/**
	 * Adds type information from the provided declarations statements to the provided compiled statements.
	 * @param {NodeArray<Statement>|SourceFile} compiledStatements
	 * @param {NodeArray<Statement>|SourceFile} declarationStatements
	 * @returns {ITypescriptPackageReassembleResult}
	 */
	public reassemble ({compiledStatements, declarationStatements}: ITypescriptPackageReassemblerOptions): ITypescriptPackageReassembleResult {
		// Handle all expressions
		this.handleAll({compiledStatements, declarationStatements});

		// Get a reference to the source file
		const sourceFile = this.getSourceFile(compiledStatements);
		// Print the changes
		const content = createPrinter().printFile(sourceFile);

		// Update the text contents
		sourceFile.text = content;

		return {
			sourceFile,
			content
		};
	}

	/**
	 * Handles all of the provided compiled statements an declaration statements
	 * @param {NodeArray<Statement>|SourceFile} compiledStatements
	 * @param {NodeArray<Statement>|SourceFile} declarationStatements
	 */
	private handleAll ({compiledStatements, declarationStatements}: ITypescriptPackageReassemblerOptions): void {
		const normalizedCompiledStatements = this.getStatements(compiledStatements);
		const normalizedDeclarationStatements = this.getStatements(declarationStatements);
		normalizedCompiledStatements.forEach(statement => this.handleMatchingExpression(statement, this.matcher.findMatchingExpression(statement, normalizedDeclarationStatements)));
	}

	/**
	 * Returns the statements of a SourceFile or the statements themselves if that is what is provided as an argument
	 * @param {NodeArray<Statement> | SourceFile} statements
	 * @returns {NodeArray<Statement>}
	 */
	private getStatements (statements: NodeArray<Statement>|SourceFile): NodeArray<Statement> {
		return Array.isArray(statements) ? statements : (<SourceFile>statements).statements;
	}

	/**
	 * Returns the first matched SourceFile of the given statements or the SourceFile itself if that is what is provided as an argument
	 * @param {NodeArray<Statement> | SourceFile} statements
	 * @returns {SourceFile}
	 */
	private getSourceFile (statements: NodeArray<Statement>|SourceFile): SourceFile {
		return this.getStatements(statements)[0].getSourceFile();
	}

	/**
	 * Handles a matching expression. This means that the compiled expression and declaration expression are related
	 * @param {Expression | Statement | Node} compiled
	 * @param {Expression | Statement | Node} declaration
	 */
	private handleMatchingExpression (compiled: Expression|Statement|Node, declaration: Expression|Statement|Node|undefined): void {
		if (declaration == null) return;
		// Assign the changes to the compiled expression
		Object.assign(compiled, this.reassembler.reassembleExpression(compiled, declaration));
	}
}