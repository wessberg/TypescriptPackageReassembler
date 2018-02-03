import {IReassembler} from "./i-reassembler";
import {ClassDeclaration, ClassElement, ComputedPropertyName, ConstructorDeclaration, createNodeArray, Expression, GetAccessorDeclaration, Identifier, isClassDeclaration, isClassElement, isComputedPropertyName, isConstructorDeclaration, isGetAccessorDeclaration, isIdentifier, isMethodDeclaration, isNumericLiteral, isParameter, isPropertyDeclaration, isPropertyName, isSetAccessorDeclaration, isStringLiteral, MethodDeclaration, Node, NodeArray, NumericLiteral, ParameterDeclaration, PropertyDeclaration, PropertyName, SetAccessorDeclaration, Statement, StringLiteral, updateClassDeclaration, updateConstructor, updateGetAccessor, updateMethod, updateParameter, updateProperty, updateSetAccessor} from "typescript";
import {IMatcher} from "../matcher/i-matcher";
import {ICopier} from "../copier/i-copier";

/**
 * A class that can "reassemble" compiled expressions with their related declarations.
 * This useful for adding type information to compiled code, for example to re-associate type info that has been compiled away.
 */
export class Reassembler implements IReassembler {
	constructor (private readonly matcher: IMatcher,
							 private readonly copier: ICopier) {
	}

	/**
	 * Reassembles any expression
	 * @param {Node} compiled
	 * @param {Node} declaration
	 * @returns {Node}
	 */
	public reassembleNode (compiled: Node, declaration: Expression|Statement|Node): Node {
		if (isStringLiteral(compiled) && isStringLiteral(declaration)) return this.reassembleStringLiteral(compiled, declaration);
		else if (isNumericLiteral(compiled) && isNumericLiteral(declaration)) return this.reassembleNumericLiteral(compiled, declaration);
		else if (isIdentifier(compiled) && isIdentifier(declaration)) return this.reassembleIdentifier(compiled, declaration);
		else if (isComputedPropertyName(compiled) && isComputedPropertyName(declaration)) return this.reassembleComputedPropertyName(compiled, declaration);
		else if (isPropertyName(compiled) && isPropertyName(declaration)) return this.reassemblePropertyName(compiled, declaration);
		else if (isPropertyDeclaration(compiled) && isPropertyDeclaration(declaration)) return this.reassemblePropertyDeclaration(compiled, declaration);
		else if (isMethodDeclaration(compiled) && isMethodDeclaration(declaration)) return this.reassembleMethodDeclaration(compiled, declaration);
		else if (isClassElement(compiled) && isClassElement(declaration)) return this.reassembleClassElement(compiled, declaration);
		else if (isClassDeclaration(compiled) && isClassDeclaration(declaration)) return this.reassembleClassDeclaration(compiled, declaration);
		else if (isParameter(compiled) && isParameter(declaration)) return this.reassembleParameterDeclaration(compiled, declaration);
		else if (isConstructorDeclaration(compiled) && isConstructorDeclaration(declaration)) return this.reassembleConstructorDeclaration(compiled, declaration);
		else if (isGetAccessorDeclaration(compiled) && isGetAccessorDeclaration(declaration)) return this.reassembleGetAccessor(compiled, declaration);
		else if (isSetAccessorDeclaration(compiled) && isSetAccessorDeclaration(declaration)) return this.reassembleSetAccessor(compiled, declaration);
		// Return the original expression.
		return compiled;
	}

	/**
	 * Reassembles a ConstructorDeclaration
	 * @param {ConstructorDeclaration} compiled
	 * @param {ConstructorDeclaration} declaration
	 * @returns {ConstructorDeclaration}
	 */
	public reassembleConstructorDeclaration (compiled: ConstructorDeclaration, declaration: ConstructorDeclaration): ConstructorDeclaration {
		return updateConstructor(
			compiled,
			compiled.decorators,
			compiled.modifiers,
			compiled.parameters.map((parameter, index) => this.reassembleParameterDeclaration(parameter, declaration.parameters[index])),
			compiled.body
		);
	}

	/**
	 * Reassembles a StringLiteral
	 * @param {StringLiteral} compiled
	 * @param {StringLiteral} _declaration
	 * @returns {StringLiteral}
	 */
	public reassembleStringLiteral (compiled: StringLiteral, _declaration: StringLiteral): StringLiteral {
		// Nothing to change here. Return the original
		return compiled;
	}

	/**
	 * Reassembles a NumericLiteral
	 * @param {NumericLiteral} compiled
	 * @param {NumericLiteral} _declaration
	 * @returns {NumericLiteral}
	 */
	public reassembleNumericLiteral (compiled: NumericLiteral, _declaration: NumericLiteral): NumericLiteral {
		// Nothing to change here. Return the original
		return compiled;
	}

	/**
	 * Reassembles an Identifier
	 * @param {Identifier} compiled
	 * @param {Identifier} _declaration
	 * @returns {Identifier}
	 */
	public reassembleIdentifier (compiled: Identifier, _declaration: Identifier): Identifier {
		// Nothing to change here. Return the original
		return compiled;
	}

	/**
	 * Reassembles a ComputedPropertyName
	 * @param {ComputedPropertyName} compiled
	 * @param {ComputedPropertyName} _declaration
	 * @returns {ComputedPropertyName}
	 */
	public reassembleComputedPropertyName (compiled: ComputedPropertyName, _declaration: ComputedPropertyName): ComputedPropertyName {
		// Nothing to change here. Return the original
		return compiled;
	}

	/**
	 * Reassembles a PropertyName
	 * @param {PropertyName} compiled
	 * @param {PropertyName} _declaration
	 * @returns {PropertyName}
	 */
	public reassemblePropertyName (compiled: PropertyName, _declaration: PropertyName): PropertyName {
		// Nothing to change here. Return the original
		return compiled;
	}

	/**
	 * Reassembles a PropertyDeclaration
	 * @param {PropertyDeclaration} compiled
	 * @param {PropertyDeclaration} declaration
	 * @returns {PropertyDeclaration}
	 */
	public reassemblePropertyDeclaration (compiled: PropertyDeclaration, declaration: PropertyDeclaration): PropertyDeclaration {
		// Assign the type of the property to the compiled one
		return updateProperty(
			compiled,
			compiled.decorators,
			compiled.modifiers,
			compiled.name,
			compiled.questionToken,
			declaration.type == null ? undefined : this.copier.copyType(declaration.type),
			compiled.initializer
		);
	}

	/**
	 * Reassembles a MethodDeclaration
	 * @param {MethodDeclaration} compiled
	 * @param {MethodDeclaration} declaration
	 * @returns {MethodDeclaration}
	 */
	public reassembleMethodDeclaration (compiled: MethodDeclaration, declaration: MethodDeclaration): MethodDeclaration {
		return updateMethod(
			compiled,
			compiled.decorators,
			compiled.modifiers,
			compiled.asteriskToken,
			compiled.name,
			compiled.questionToken,
			declaration.typeParameters == null ? undefined : this.copier.copyTypeParameterDeclarations(declaration.typeParameters),
			compiled.parameters.map((parameter, index) => this.reassembleParameterDeclaration(parameter, declaration.parameters[index])),
			declaration.type == null ? undefined : this.copier.copyType(declaration.type),
			compiled.body
		);
	}

	/**
	 * Reassembles a ClassElement
	 * @param {ClassElement} compiled
	 * @param {ClassElement} declaration
	 * @returns {ClassElement}
	 */
	public reassembleClassElement (compiled: ClassElement, declaration: ClassElement): ClassElement {
		if (isConstructorDeclaration(compiled) && isConstructorDeclaration(declaration)) return this.reassembleConstructorDeclaration(compiled, declaration);
		else if (isPropertyDeclaration(compiled) && isPropertyDeclaration(declaration)) return this.reassemblePropertyDeclaration(compiled, declaration);
		else if (isMethodDeclaration(compiled) && isMethodDeclaration(declaration)) return this.reassembleMethodDeclaration(compiled, declaration);
		else if (isGetAccessorDeclaration(compiled) && isGetAccessorDeclaration(declaration)) return this.reassembleGetAccessor(compiled, declaration);
		else if (isSetAccessorDeclaration(compiled) && isSetAccessorDeclaration(declaration)) return this.reassembleSetAccessor(compiled, declaration);
		// Nothing to change here. Return the original
		return compiled;
	}

	/**
	 * Reassembles the provided ClassElement with the one of the provided declarations that matches it
	 * @param {ClassElement} compiled
	 * @param {NodeArray<ClassElement>} declarations
	 * @returns {ClassElement}
	 */
	public reassembleMatchingClassElement (compiled: ClassElement, declarations: NodeArray<ClassElement>): ClassElement {
		const match = this.matcher.findMatchingClassElement(compiled, declarations);
		if (match == null) return compiled;

		if (isConstructorDeclaration(compiled)) {
			return this.reassembleConstructorDeclaration(compiled, <ConstructorDeclaration> match);
		}

		else if (isMethodDeclaration(compiled)) {
			return this.reassembleMethodDeclaration(compiled, <MethodDeclaration> match);
		}

		else if (isPropertyDeclaration(compiled)) {
			return this.reassemblePropertyDeclaration(compiled, <PropertyDeclaration> match);
		}

		else if (isGetAccessorDeclaration(compiled)) {
			return this.reassembleGetAccessor(compiled, <GetAccessorDeclaration> match);
		}

		else if (isSetAccessorDeclaration(compiled)) {
			return this.reassembleSetAccessor(compiled, <SetAccessorDeclaration> match);
		}

		return compiled;
	}

	/**
	 * Reassembles the provided GetAccessorDeclaration
	 * @param {GetAccessorDeclaration} compiled
	 * @param {GetAccessorDeclaration} declaration
	 * @returns {GetAccessorDeclaration}
	 */
	public reassembleGetAccessor (compiled: GetAccessorDeclaration, declaration: GetAccessorDeclaration): GetAccessorDeclaration {
		return updateGetAccessor(
			compiled,
			compiled.decorators,
			compiled.modifiers,
			compiled.name,
			compiled.parameters.map((parameter, index) => this.reassembleParameterDeclaration(parameter, declaration.parameters[index])),
			declaration.type == null ? undefined : this.copier.copyType(declaration.type),
			compiled.body
		);
	}

	/**
	 * Reassembles the provided SetAccessorDeclaration
	 * @param {SetAccessorDeclaration} compiled
	 * @param {SetAccessorDeclaration} declaration
	 * @returns {SetAccessorDeclaration}
	 */
	public reassembleSetAccessor (compiled: SetAccessorDeclaration, declaration: SetAccessorDeclaration): SetAccessorDeclaration {
		return updateSetAccessor(
			compiled,
			compiled.decorators,
			compiled.modifiers,
			compiled.name,
			compiled.parameters.map((parameter, index) => this.reassembleParameterDeclaration(parameter, declaration.parameters[index])),
			compiled.body
		);
	}

	/**
	 * Reassembles the provided ClassDeclaration
	 * @param {ClassDeclaration} compiled
	 * @param {ClassDeclaration} declaration
	 * @returns {ClassDeclaration}
	 */
	public reassembleClassDeclaration (compiled: ClassDeclaration, declaration: ClassDeclaration): ClassDeclaration {
		return updateClassDeclaration(
			compiled,
			compiled.decorators,
			compiled.modifiers,
			compiled.name,
			declaration.typeParameters == null ? undefined : this.copier.copyTypeParameterDeclarations(declaration.typeParameters),
			declaration.heritageClauses == null ? createNodeArray() : this.copier.copyHeritageClauses(declaration.heritageClauses),
			compiled.members.map(member => this.reassembleMatchingClassElement(member, declaration.members))
		);
	}

	/**
	 * Reassembles the provided ParameterDeclaration
	 * @param {ParameterDeclaration} compiled
	 * @param {ParameterDeclaration} declaration
	 * @returns {ParameterDeclaration}
	 */
	public reassembleParameterDeclaration (compiled: ParameterDeclaration, declaration: ParameterDeclaration): ParameterDeclaration {
		// Assign the type of the parameter to the compiled one
		return updateParameter(
			compiled,
			compiled.decorators,
			compiled.modifiers,
			compiled.dotDotDotToken,
			compiled.name,
			compiled.questionToken,
			declaration.type == null ? undefined : this.copier.copyType(declaration.type),
			compiled.initializer
		);
	}
}