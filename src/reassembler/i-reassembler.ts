import {ClassDeclaration, Modifier, FunctionLikeDeclaration, NodeArray, ClassElement, AccessorDeclaration, ConstructorDeclaration, ComputedPropertyName, Expression, ParameterDeclaration, Identifier, MethodDeclaration, Node, NumericLiteral, PropertyDeclaration, PropertyName, Statement, StringLiteral} from "typescript";
export interface IReassembler {
	reassembleModifiers (compiled: Statement|Expression|Node, declaration: NodeArray<Modifier>|undefined): NodeArray<Modifier>|undefined;
	reassembleFunctionLikeDeclaration (compiled: FunctionLikeDeclaration, declaration: FunctionLikeDeclaration): FunctionLikeDeclaration;
	reassembleExpression (compiled: Expression|Statement|Node, declaration: Expression|Statement|Node): Expression|Statement|Node;
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
	reassembleAccessor (compiled: AccessorDeclaration, declaration: AccessorDeclaration): AccessorDeclaration;
}