import {ClassDeclaration, ClassElement, ComputedPropertyName, GetAccessorDeclaration, Identifier, MethodDeclaration, Node, NodeArray, NumericLiteral, PropertyDeclaration, PropertyName, SetAccessorDeclaration, SourceFile, StringLiteral} from "typescript";

export interface IMatcher {
	isNodeMatching (compiled: Node, declaration: Node): boolean;
	findMatchingNode (compiled: Node, declarations: NodeArray<Node>|SourceFile): Node|undefined;
	findMatchingClassElement (compiled: ClassElement, declarations: NodeArray<Node>): ClassElement|undefined;
	hasMatchingClassElement (compiled: ClassElement, declarations: NodeArray<Node>): boolean;
	isStringLiteralMatching (compiled: StringLiteral, declaration: StringLiteral): boolean;
	isNumericLiteralMatching (compiled: NumericLiteral, declaration: NumericLiteral): boolean;
	isIdentifierMatching (compiled: Identifier, declaration: Identifier): boolean;
	isComputedPropertyNameMatching (compiled: ComputedPropertyName, declaration: ComputedPropertyName): boolean;
	isPropertyNameMatching (compiled: PropertyName, declaration: PropertyName): boolean;
	isPropertyDeclarationMatching (compiled: PropertyDeclaration, declaration: PropertyDeclaration): boolean;
	isMethodDeclarationMatching (compiled: MethodDeclaration, declaration: MethodDeclaration): boolean;
	isClassElementMatching (compiled: ClassElement, declaration: ClassElement): boolean;
	isClassDeclarationMatching (compiled: ClassDeclaration, declaration: ClassDeclaration): boolean;
	isGetAccessorMatching (compiled: GetAccessorDeclaration, declaration: GetAccessorDeclaration): boolean;
	isSetAccessorMatching (compiled: SetAccessorDeclaration, declaration: SetAccessorDeclaration): boolean;
}