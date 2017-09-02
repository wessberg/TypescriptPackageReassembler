import {createPrinter, Expression, isSourceFile, Node, NodeArray, SourceFile, Statement, transform, TransformationContext, TransformerFactory, visitEachChild, VisitResult} from "typescript";
import {ITypescriptPackageReassembler} from "./i-typescript-package-reassembler";
import {ITypescriptPackageReassemblerOptions} from "./i-typescript-package-reassembler-options";
import {ITypescriptPackageReassembleResult} from "./i-typescript-package-reassemble-result";
import {IMatcher} from "../matcher/i-matcher";
import {IReassembler} from "../reassembler/i-reassembler";
import {Matcher} from "../matcher/matcher";
import {Reassembler} from "../reassembler/reassembler";
import {ITransformUtil} from "../util/transform-util/i-transform-util";
import {TransformUtil} from "../util/transform-util/transform-util";
import {ICopier} from "../copier/i-copier";
import {Copier} from "../copier/copier";

/**
 * A class that can add type information from the provided declarations statements to the provided compiled statements.
 * This is meant for "merging" a declaration file (.d.ts) with a compiled source file (.js)
 */
export class TypescriptPackageReassembler implements ITypescriptPackageReassembler {
	/**
	 * The TransformUtil will help with general transformation-related tasks
	 * @type {TransformUtil}
	 */
	private readonly transformUtil: ITransformUtil = new TransformUtil();

	/**
	 * A Copier can generate new Typescript AST nodes
	 * @type {Copier}
	 */
	private readonly copier: ICopier = new Copier();
	/**
	 * The matcher will figure out which expressions fits which statements
	 * @type {Matcher}
	 */
	private readonly matcher: IMatcher = new Matcher(this.transformUtil);

	/**
	 * The reassembler will set type information on the statements of the compiled code
	 * @type {Reassembler}
	 */
	private readonly reassembler: IReassembler = new Reassembler(this.matcher, this.copier);

	/**
	 * Adds type information from the provided declarations statements to the provided compiled statements.
	 * @param {NodeArray<Statement>|SourceFile} compiledStatements
	 * @param {NodeArray<Statement>|SourceFile} declarationStatements
	 * @returns {ITypescriptPackageReassembleResult}
	 */
	public reassemble ({compiledStatements, declarationStatements}: ITypescriptPackageReassemblerOptions): ITypescriptPackageReassembleResult {
		const compiledSourceFile = this.transformUtil.getSourceFile(compiledStatements);
		// Transform all of the statements
		const {transformed} = transform(compiledSourceFile, [this.transform(declarationStatements)]);
		// Take the new sourceFile
		const [sourceFile] = transformed;
		// Print the contents
		const printer = createPrinter();
		const content = printer.printFile(sourceFile);
		return {
			sourceFile,
			content
		};
	}

	/**
	 * Hooks up a Transformer. The declaration statements will be passed along for each node
	 * @param {NodeArray<Node> | SourceFile} declarationStatements
	 * @returns {TransformerFactory<SourceFile>}
	 */
	private transform (declarationStatements: NodeArray<Node>|SourceFile): TransformerFactory<SourceFile> {
		return (transformContext) => {
			return (tsSourceFile: SourceFile) => {
				return <SourceFile> this.visit(tsSourceFile, transformContext, declarationStatements);
			};
		};
	}

	/**
	 * Visits a node in the AST
	 * @param {Node} node
	 * @param {TransformationContext} transformContext
	 * @param {NodeArray<Node> | SourceFile} declarationStatements
	 * @returns {VisitResult<Node>}
	 */
	private visit (node: Node, transformContext: TransformationContext, declarationStatements: NodeArray<Node>|SourceFile): VisitResult<Node> {
		if (isSourceFile(node)) {
			return visitEachChild(node, child => {
				return this.visit(child, transformContext, declarationStatements);
			}, transformContext);
		} else {
			return this.handleMatchingNode(node, this.matcher.findMatchingNode(node, declarationStatements));
		}
	}

	/**
	 * Handles a matching expression. This means that the compiled expression and declaration expression are related
	 * @param {Node} compiled
	 * @param {Node} declaration
	 * @returns {Node}
	 */
	private handleMatchingNode (compiled: Expression|Statement|Node, declaration: Node|undefined): Node {
		if (declaration == null) return compiled;
		// Assign the changes to the compiled expression
		return this.reassembler.reassembleNode(compiled, declaration);
	}
}