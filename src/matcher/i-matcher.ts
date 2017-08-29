import {ClassDeclaration, ClassElement, AccessorDeclaration, ComputedPropertyName, Expression, Identifier, MethodDeclaration, Node, NodeArray, NumericLiteral, PropertyDeclaration, PropertyName, Statement, StringLiteral} from "typescript";

export interface IMatcher {
	isExpressionMatching (compiled: Expression|Statement|Node, declaration: Expression|Statement|Node): boolean;
	findMatchingExpression (compiled: Expression|Statement|Node, declarations: NodeArray<Statement|Expression|Node>): Expression|undefined;
	findMatchingClassElement (compiled: ClassElement, declarations: NodeArray<Statement|Expression|Node>): ClassElement|undefined;
	hasMatchingClassElement (compiled: ClassElement, declarations: NodeArray<Statement|Expression|Node>): boolean;
	isStringLiteralMatching (compiled: StringLiteral, declaration: StringLiteral): boolean;
	isNumericLiteralMatching (compiled: NumericLiteral, declaration: NumericLiteral): boolean;
	isIdentifierMatching (compiled: Identifier, declaration: Identifier): boolean;
	isComputedPropertyNameMatching (compiled: ComputedPropertyName, declaration: ComputedPropertyName): boolean;
	isPropertyNameMatching (compiled: PropertyName, declaration: PropertyName): boolean;
	isPropertyDeclarationMatching (compiled: PropertyDeclaration, declaration: PropertyDeclaration): boolean;
	isMethodDeclarationMatching (compiled: MethodDeclaration, declaration: MethodDeclaration): boolean;
	isClassElementMatching (compiled: ClassElement, declaration: ClassElement): boolean;
	isClassDeclarationMatching (compiled: ClassDeclaration, declaration: ClassDeclaration): boolean;
	isAccessorMatching (compiled: AccessorDeclaration, declaration: AccessorDeclaration): boolean;
}