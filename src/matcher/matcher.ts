import {ClassDeclaration, ClassElement, ComputedPropertyName, Expression, GetAccessorDeclaration, Identifier, isClassDeclaration, isClassElement, isComputedPropertyName, isConstructorDeclaration, isGetAccessorDeclaration, isIdentifier, isMethodDeclaration, isNumericLiteral, isPropertyDeclaration, isPropertyName, isSetAccessorDeclaration, isStringLiteral, MethodDeclaration, Node, NodeArray, NumericLiteral, PropertyDeclaration, PropertyName, SetAccessorDeclaration, SourceFile, Statement, StringLiteral} from "typescript";
import {IMatcher} from "./i-matcher";
import {ITransformUtil} from "../util/transform-util/i-transform-util";

/**
 * A class that can match compiled statements with their declaration counterparts
 */
export class Matcher implements IMatcher {

	constructor (private transformUtil: ITransformUtil) {
	}

	/**
	 * Returns true if the two expressions are matching
	 * @param {Expression | Statement | Node} compiled
	 * @param {Expression | Statement | Node} declaration
	 * @returns {boolean}
	 */
	public isNodeMatching (compiled: Expression|Statement|Node, declaration: Expression|Statement|Node): boolean {
		if (isClassDeclaration(compiled) && isClassDeclaration(declaration)) return this.isClassDeclarationMatching(compiled, declaration);
		else if (isStringLiteral(compiled) && isStringLiteral(declaration)) return this.isStringLiteralMatching(compiled, declaration);
		else if (isNumericLiteral(compiled) && isNumericLiteral(declaration)) return this.isNumericLiteralMatching(compiled, declaration);
		else if (isIdentifier(compiled) && isIdentifier(declaration)) return this.isIdentifierMatching(compiled, declaration);
		else if (isComputedPropertyName(compiled) && isComputedPropertyName(declaration)) return this.isComputedPropertyNameMatching(compiled, declaration);
		else if (isPropertyName(compiled) && isPropertyName(declaration)) return this.isPropertyNameMatching(compiled, declaration);
		else if (isPropertyDeclaration(compiled) && isPropertyDeclaration(declaration)) return this.isPropertyDeclarationMatching(compiled, declaration);
		else if (isMethodDeclaration(compiled) && isMethodDeclaration(declaration)) return this.isMethodDeclarationMatching(compiled, declaration);
		else if (isClassElement(compiled) && isClassElement(declaration)) return this.isClassElementMatching(compiled, declaration);
		else if (isGetAccessorDeclaration(compiled) && isGetAccessorDeclaration(declaration)) return this.isGetAccessorMatching(compiled, declaration);
		else if (isSetAccessorDeclaration(compiled) && isSetAccessorDeclaration(declaration)) return this.isSetAccessorMatching(compiled, declaration);
		return false;
	}

	/**
	 * Finds the declaration statement that matches the provided compiled expression
	 * @param {Expression | Statement | Node} compiled
	 * @param {NodeArray<Statement | Expression | Node>|SourceFile} declarations
	 * @returns {Expression}
	 */
	public findMatchingNode (compiled: Expression|Statement|Node, declarations: NodeArray<Statement|Expression|Node>|SourceFile): Expression|undefined {
		return <Expression|undefined> this.transformUtil.getStatements(declarations).find(declaration => this.isNodeMatching(compiled, declaration));
	}

	/**
	 * Finds the matching declaration ClassElement for the compiled one
	 * @param {ClassElement} compiled
	 * @param {NodeArray<Statement | Expression | Node>} declarations
	 * @returns {ClassElement}
	 */
	public findMatchingClassElement (compiled: ClassElement, declarations: NodeArray<Statement|Expression|Node>): ClassElement|undefined {
		return <PropertyDeclaration|undefined> declarations.find(declaration => isClassElement(declaration) && this.isClassElementMatching(compiled, declaration));
	}

	/**
	 * Returns true if the provided compiled ClassElement has a match in the given NodeArray of statements
	 * @param {ClassElement} compiled
	 * @param {NodeArray<Statement | Expression | Node>} declarations
	 * @returns {boolean}
	 */
	public hasMatchingClassElement (compiled: ClassElement, declarations: NodeArray<Statement|Expression|Node>): boolean {
		return this.findMatchingClassElement(compiled, declarations) != null;
	}

	/**
	 * Returns true if the compiled StringLiteral is related to the provided declaration
	 * @param {StringLiteral} compiled
	 * @param {StringLiteral} declaration
	 * @returns {boolean}
	 */
	public isStringLiteralMatching (compiled: StringLiteral, declaration: StringLiteral): boolean {
		return compiled.text === declaration.text;
	}

	/**
	 * Returns true if the compiled NumericLiteral is related to the provided declaration
	 * @param {NumericLiteral} compiled
	 * @param {NumericLiteral} declaration
	 * @returns {boolean}
	 */
	public isNumericLiteralMatching (compiled: NumericLiteral, declaration: NumericLiteral): boolean {
		return compiled.text === declaration.text;
	}

	/**
	 * Returns true if the compiled Identifier is related to the provided declaration
	 * @param {Identifier} compiled
	 * @param {Identifier} declaration
	 * @returns {boolean}
	 */
	public isIdentifierMatching (compiled: Identifier, declaration: Identifier): boolean {
		return compiled.text === declaration.text;
	}

	/**
	 * Returns true if the compiled ComputedPropertyName is related to the provided declaration
	 * @param {ComputedPropertyName} compiled
	 * @param {ComputedPropertyName} declaration
	 * @returns {boolean}
	 */
	public isComputedPropertyNameMatching (compiled: ComputedPropertyName, declaration: ComputedPropertyName): boolean {
		return this.isNodeMatching(compiled.expression, declaration.expression);
	}

	/**
	 * Returns true if the compiled PropertyName is related to the provided declaration
	 * @param {PropertyName} compiled
	 * @param {PropertyName} declaration
	 * @returns {boolean}
	 */
	public isPropertyNameMatching (compiled: PropertyName, declaration: PropertyName): boolean {
		if (isIdentifier(compiled) && isIdentifier(declaration)) return this.isIdentifierMatching(compiled, declaration);
		else if (isStringLiteral(compiled) && isStringLiteral(declaration)) return this.isStringLiteralMatching(compiled, declaration);
		else if (isNumericLiteral(compiled) && isNumericLiteral(declaration)) return this.isNumericLiteralMatching(compiled, declaration);
		else if (isComputedPropertyName(compiled) && isComputedPropertyName(declaration)) return this.isComputedPropertyNameMatching(compiled, declaration);
		return false;
	}

	/**
	 * Returns true if the compiled PropertyDeclaration is related to the provided declaration
	 * @param {PropertyDeclaration} compiled
	 * @param {PropertyDeclaration} declaration
	 * @returns {boolean}
	 */
	public isPropertyDeclarationMatching (compiled: PropertyDeclaration, declaration: PropertyDeclaration): boolean {
		// They will be matching if their names are identical
		return this.isPropertyNameMatching(compiled.name, declaration.name);
	}

	/**
	 * Returns true if the compiled GetAccessorDeclaration is related to the provided declaration
	 * @param {GetAccessorDeclaration} compiled
	 * @param {GetAccessorDeclaration} declaration
	 * @returns {boolean}
	 */
	public isGetAccessorMatching (compiled: GetAccessorDeclaration, declaration: GetAccessorDeclaration): boolean {
		// They will be matching if their names are identical
		return this.isPropertyNameMatching(compiled.name, declaration.name);
	}

	/**
	 * Returns true if the compiled GetAccessorDeclaration is related to the provided declaration
	 * @param {SetAccessorDeclaration} compiled
	 * @param {SetAccessorDeclaration} declaration
	 * @returns {boolean}
	 */
	public isSetAccessorMatching (compiled: SetAccessorDeclaration, declaration: SetAccessorDeclaration): boolean {
		// They will be matching if their names are identical
		return this.isPropertyNameMatching(compiled.name, declaration.name);
	}

	/**
	 * Returns true if the compiled MethodDeclaration is related to the provided declaration
	 * @param {MethodDeclaration} compiled
	 * @param {MethodDeclaration} declaration
	 * @returns {boolean}
	 */
	public isMethodDeclarationMatching (compiled: MethodDeclaration, declaration: MethodDeclaration): boolean {
		// They will be matching if their names are identical
		return this.isPropertyNameMatching(compiled.name, declaration.name);
	}

	/**
	 * Returns true if the compiled ClassElement is related to the provided declaration
	 * @param {ClassElement} compiled
	 * @param {ClassElement} declaration
	 * @returns {boolean}
	 */
	public isClassElementMatching (compiled: ClassElement, declaration: ClassElement): boolean {
		if (isPropertyDeclaration(compiled) && isPropertyDeclaration(declaration)) return this.isPropertyDeclarationMatching(compiled, declaration);
		else if (isMethodDeclaration(compiled) && isMethodDeclaration(declaration)) return this.isMethodDeclarationMatching(compiled, declaration);
		else if (isGetAccessorDeclaration(compiled) && isGetAccessorDeclaration(declaration)) return this.isGetAccessorMatching(compiled, declaration);
		else if (isSetAccessorDeclaration(compiled) && isSetAccessorDeclaration(declaration)) return this.isSetAccessorMatching(compiled, declaration);
		else if (isConstructorDeclaration(compiled) && isConstructorDeclaration(declaration)) return true;
		return false;
	}

	/**
	 * Returns true if the compiled ClassDeclaration is related to the provided declaration
	 * @param {ClassDeclaration} compiled
	 * @param {ClassDeclaration} declaration
	 * @returns {boolean}
	 */
	public isClassDeclarationMatching (compiled: ClassDeclaration, declaration: ClassDeclaration): boolean {
		// If it has a name, return true if it matches the one of the compiled class
		if (declaration.name != null && compiled.name != null) {
			return declaration.name.text === compiled.name.text;
		}

		// Otherwise, verify that for all of its members, the declaration has at least one matching member
		return compiled.members.every(member => this.hasMatchingClassElement(member, declaration.members));
	}
}