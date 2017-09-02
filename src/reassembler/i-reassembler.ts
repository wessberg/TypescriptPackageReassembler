import {ClassDeclaration, ClassElement, ComputedPropertyName, ConstructorDeclaration, GetAccessorDeclaration, Identifier, MethodDeclaration, Node, NumericLiteral, ParameterDeclaration, PropertyDeclaration, PropertyName, SetAccessorDeclaration, StringLiteral} from "typescript";

export interface IReassembler {
	reassembleNode (compiled: Node, declaration: Node): Node;
	reassembleStringLiteral (compiled: StringLiteral, declaration: StringLiteral): StringLiteral;
	reassembleNumericLiteral (compiled: NumericLiteral, declaration: NumericLiteral): NumericLiteral;
	reassembleIdentifier (compiled: Identifier, declaration: Identifier): Identifier;
	reassembleComputedPropertyName (compiled: ComputedPropertyName, declaration: ComputedPropertyName): ComputedPropertyName;
	reassemblePropertyName (compiled: PropertyName, declaration: PropertyName): PropertyName;
	reassemblePropertyDeclaration (compiled: PropertyDeclaration, declaration: PropertyDeclaration): PropertyDeclaration;
	reassembleMethodDeclaration (compiled: MethodDeclaration, declaration: MethodDeclaration): MethodDeclaration;
	reassembleClassElement (compiled: ClassElement, declaration: ClassElement): ClassElement;
	reassembleClassDeclaration (compiled: ClassDeclaration, declaration: ClassDeclaration): ClassDeclaration;
	reassembleParameterDeclaration (compiled: ParameterDeclaration, declaration: ParameterDeclaration): ParameterDeclaration;
	reassembleConstructorDeclaration (compiled: ConstructorDeclaration, declaration: ConstructorDeclaration): ConstructorDeclaration;
	reassembleGetAccessor (compiled: GetAccessorDeclaration, declaration: GetAccessorDeclaration): GetAccessorDeclaration;
	reassembleSetAccessor (compiled: SetAccessorDeclaration, declaration: SetAccessorDeclaration): SetAccessorDeclaration;
}