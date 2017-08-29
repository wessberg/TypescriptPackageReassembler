import {IReassembler} from "./i-reassembler";
import {AccessorDeclaration, ClassDeclaration, ClassElement, ComputedPropertyName, ConstructorDeclaration, createNodeArray, Expression, FunctionLikeDeclaration, Identifier, isAccessor, isClassDeclaration, isClassElement, isComputedPropertyName, isConstructorDeclaration, isIdentifier, isMethodDeclaration, isNumericLiteral, isParameter, isPropertyDeclaration, isPropertyName, isStringLiteral, MethodDeclaration, Modifier, Node, NodeArray, NumericLiteral, ParameterDeclaration, PropertyDeclaration, PropertyName, Statement, StringLiteral} from "typescript";

/**
 * A class that can "reassemble" compiled expressions with their related declarations.
 * This useful for adding type information to compiled code, for example to re-associate type info that has been compiled away.
 */
export class Reassembler implements IReassembler {

	/**
	 * Reassembles any expression
	 * @param {Expression | Statement | Node} compiled
	 * @param {Expression | Statement | Node} declaration
	 * @returns {Expression | Statement | Node}
	 */
	public reassembleExpression (compiled: Expression|Statement|Node, declaration: Expression|Statement|Node): Expression|Statement|Node {
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
		else if (isAccessor(compiled) && isAccessor(declaration)) return this.reassembleAccessor(compiled, declaration);
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
		return this.reassembleFunctionLikeDeclaration(compiled, declaration);
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
	 * Reassembles a FunctionLikeDeclaration
	 * @template T
	 * @param {T} compiled
	 * @param {T} declaration
	 * @returns {T}
	 */
	public reassembleFunctionLikeDeclaration<T extends FunctionLikeDeclaration> (compiled: T, declaration: T): T {
		// Assign the type of the accessor to the compiled one
		const parent = compiled;
		compiled.type = declaration.type;
		// Re-assign the old parent to the type
		if (compiled.type != null) compiled.type.parent = parent;

		// Assign the parameters to the compiled one.
		compiled.parameters = createNodeArray(compiled.parameters.map((parameter, index) => this.reassembleParameterDeclaration(parameter, declaration.parameters[index])));
		compiled.modifiers = this.reassembleModifiers(compiled, declaration.modifiers);
		return compiled;
	}

	/**
	 * Sets all the provided modifiers on the given compiled statement
	 * @param {Statement|Expression|Node} compiled
	 * @param {NodeArray<Modifier>} [declaration]
	 * @returns {NodeArray<Modifier>?}
	 */
	public reassembleModifiers (compiled: Statement|Expression|Node, declaration: NodeArray<Modifier>|undefined): NodeArray<Modifier>|undefined {
		if (declaration == null) return compiled.modifiers;
		const newModifiers: Modifier[] = [...(compiled.modifiers == null ? [] : compiled.modifiers)];
		declaration.forEach(modifier => {
			// If the compiled one doesn't already have the modifier
			if (compiled.modifiers != null && !compiled.modifiers.some(compiledModifier => compiledModifier.kind === modifier.kind)) {
				modifier.parent = compiled;
				newModifiers.push(modifier);
			}
		});
		compiled.modifiers = createNodeArray(newModifiers);
		return compiled.modifiers;
	}

	/**
	 * Reassembles a PropertyDeclaration
	 * @param {PropertyDeclaration} compiled
	 * @param {PropertyDeclaration} declaration
	 * @returns {PropertyDeclaration}
	 */
	public reassemblePropertyDeclaration (compiled: PropertyDeclaration, declaration: PropertyDeclaration): PropertyDeclaration {
		// Assign the type of the accessor to the compiled one
		const parent = compiled;
		compiled.type = declaration.type;
		// Re-assign the old parent to the type
		if (compiled.type != null) compiled.type.parent = parent;

		// Assign the parameters to the compiled one.
		compiled.modifiers = this.reassembleModifiers(compiled, declaration.modifiers);
		return compiled;
	}

	/**
	 * Reassembles a MethodDeclaration
	 * @param {MethodDeclaration} compiled
	 * @param {MethodDeclaration} declaration
	 * @returns {MethodDeclaration}
	 */
	public reassembleMethodDeclaration (compiled: MethodDeclaration, declaration: MethodDeclaration): MethodDeclaration {
		return this.reassembleFunctionLikeDeclaration(compiled, declaration);
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
		else if (isAccessor(compiled) && isAccessor(declaration)) return this.reassembleAccessor(compiled, declaration);
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
		if (isConstructorDeclaration(compiled)) {
			const constructorMatch = <ConstructorDeclaration|undefined> declarations.find(member => isConstructorDeclaration(member));
			if (constructorMatch == null) return compiled;
			return this.reassembleConstructorDeclaration(compiled, constructorMatch);
		}

		else if (isMethodDeclaration(compiled)) {
			const methodMatch = <MethodDeclaration|undefined> declarations.find(member => isMethodDeclaration(member));
			if (methodMatch == null) return compiled;
			return this.reassembleMethodDeclaration(compiled, methodMatch);
		}

		else if (isPropertyDeclaration(compiled)) {
			const propertyMatch = <PropertyDeclaration|undefined> declarations.find(member => isPropertyDeclaration(member));
			if (propertyMatch == null) return compiled;
			return this.reassemblePropertyDeclaration(compiled, propertyMatch);
		}

		else if (isAccessor(compiled)) {
			const accessorMatch = <AccessorDeclaration|undefined> declarations.find(member => isAccessor(member));
			if (accessorMatch == null) return compiled;
			return this.reassembleAccessor(compiled, accessorMatch);
		}
		return compiled;
	}

	/**
	 * Reassembles the provided AccessorDeclaration
	 * @param {AccessorDeclaration} compiled
	 * @param {AccessorDeclaration} declaration
	 * @returns {AccessorDeclaration}
	 */
	public reassembleAccessor (compiled: AccessorDeclaration, declaration: AccessorDeclaration): AccessorDeclaration {
		return this.reassembleFunctionLikeDeclaration(compiled, declaration);
	}

	/**
	 * Reassembles the provided ClassDeclaration
	 * @param {ClassDeclaration} compiled
	 * @param {ClassDeclaration} declaration
	 * @returns {ClassDeclaration}
	 */
	public reassembleClassDeclaration (compiled: ClassDeclaration, declaration: ClassDeclaration): ClassDeclaration {
		// TODO: Add "implements" heritage back-in. This will be stripped away!
		compiled.members.forEach(member => this.reassembleMatchingClassElement(member, declaration.members));
		return compiled;
	}

	/**
	 * Reassembles the provided ParameterDeclaration
	 * @param {ParameterDeclaration} compiled
	 * @param {ParameterDeclaration} declaration
	 * @returns {ParameterDeclaration}
	 */
	public reassembleParameterDeclaration (compiled: ParameterDeclaration, declaration: ParameterDeclaration): ParameterDeclaration {
		// Assign the type of the parameter to the compiled one
		const parent = compiled;
		compiled.type = declaration.type;
		// Re-assign the old parent to the type
		if (compiled.type != null) compiled.type.parent = parent;

		// Set all modifiers
		compiled.modifiers = this.reassembleModifiers(compiled, declaration.modifiers);
		return compiled;
	}

}