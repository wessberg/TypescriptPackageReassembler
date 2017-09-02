import {ArrayBindingElement, ArrayBindingPattern, UnionTypeNode, TupleTypeNode, ParenthesizedTypeNode, isParenthesizedTypeNode, createParenthesizedType, isTupleTypeNode, createTupleTypeNode, isUnionTypeNode, createUnionTypeNode, ArrayTypeNode, isArrayTypeNode, createArrayTypeNode, IntersectionTypeNode, isIntersectionTypeNode, createIntersectionTypeNode, BindingElement, createTrue, createFalse, BooleanLiteral, createNumericLiteral, BindingName, ComputedPropertyName, createArrayBindingPattern, createBindingElement, createComputedPropertyName, createDecorator, createExpressionWithTypeArguments, createFunctionTypeNode, createHeritageClause, createIdentifier, createIndexedAccessTypeNode, createKeywordTypeNode, createLiteral, createLiteralTypeNode, createMappedTypeNode, createNode, createNodeArray, createObjectBindingPattern, createOmittedExpression, createParameter, createPropertySignature, createQualifiedName, createToken, createTypeLiteralNode, createTypeOperatorNode, createTypeParameterDeclaration, createTypeReferenceNode, Decorator, EntityName, Expression, ExpressionWithTypeArguments, FunctionTypeNode, HeritageClause, Identifier, IndexedAccessTypeNode, isArrayBindingPattern, isBindingElement, isFunctionTypeNode, isIdentifier, isIndexedAccessTypeNode, isLiteralTypeNode, isMappedTypeNode, isNumericLiteral, isPropertySignature, isQualifiedName, isStringLiteral, isTypeLiteralNode, isTypeOperatorNode, isTypeReferenceNode, KeywordTypeNode, LiteralTypeNode, MappedTypeNode, Modifier, NodeArray, NodeFlags, NumericLiteral, ObjectBindingPattern, OmittedExpression, ParameterDeclaration, PropertyName, PropertySignature, QualifiedName, StringLiteral, SyntaxKind, Token, TypeElement, TypeLiteralNode, TypeNode, TypeOperatorNode, TypeParameterDeclaration, TypeReferenceNode} from "typescript";
import {ICopier} from "./i-copier";
import {isKeywordTypeNode} from "../predicate/keyword-type-node/is-keyword-type-node";
import {isBooleanLiteral, isLastTypeNode, LastTypeNode} from "@wessberg/typescript-ast-util";

/**
 * A class that can copy nodes
 */
export class Copier implements ICopier {
	/**
	 * Copies a TypeNode
	 * @param {TypeNode} type
	 * @returns {TypeNode}
	 */
	public copyType (type: TypeNode): TypeNode {

		if (isLiteralTypeNode(type)) {
			return this.copyLiteralTypeNode(type);
		}

		else if (isTypeReferenceNode(type)) {
			return this.copyTypeReferenceNode(type);
		}
		else if (isKeywordTypeNode(type)) {
			return this.copyKeywordTypeNode(type);
		}

		else if (isTypeLiteralNode(type)) {
			return this.copyTypeLiteralNode(type);
		}

		else if (isLastTypeNode(type)) {
			return <TypeNode> </*tslint:disable*/any/*tslint:disable*/> this.copyLastTypeNode(type);
		}

		else if (isFunctionTypeNode(type)) {
			return this.copyFunctionTypeNode(type);
		}

		else if (isMappedTypeNode(type)) {
			return this.copyMappedTypeNode(type);
		}

		else if (isTypeOperatorNode(type)) {
			return this.copyTypeOperatorNode(type);
		}

		else if (isIndexedAccessTypeNode(type)) {
			return this.copyIndexedAccessTypeNode(type);
		}

		else if (isUnionTypeNode(type)) {
			return this.copyUnionTypeNode(type);
		}

		else if (isIntersectionTypeNode(type)) {
			return this.copyIntersectionTypeNode(type);
		}

		else if (isArrayTypeNode(type)) {
			return this.copyArrayTypeNode(type);
		}

		else if (isTupleTypeNode(type)) {
			return this.copyTupleTypeNode(type);
		}

		else if (isParenthesizedTypeNode(type)) {
			return this.copyParenthesizedType(type);
		}

		console.log(`${this.constructor.name} could not format a type of kind`, SyntaxKind[type.kind], "around here:", type.getSourceFile().text.slice(type.pos, type.end));
		return type;
	}

	/**
	 * Copies a LiteralTypeNode
	 * @param {LiteralTypeNode} type
	 * @returns {LiteralTypeNode}
	 */
	public copyLiteralTypeNode (type: LiteralTypeNode): LiteralTypeNode {
		return createLiteralTypeNode(this.copyExpression(type.literal));
	}

	/**
	 * Copies a ParenthesizedTypeNode
	 * @param {ParenthesizedTypeNode} type
	 * @returns {ParenthesizedTypeNode}
	 */
	public copyParenthesizedType (type: ParenthesizedTypeNode): ParenthesizedTypeNode {
		return createParenthesizedType(this.copyType(type.type));
	}

	/**
	 * Copies a TupleTypeNode
	 * @param {TupleTypeNode} type
	 * @returns {TupleTypeNode}
	 */
	public copyTupleTypeNode (type: TupleTypeNode): TupleTypeNode {
		return createTupleTypeNode(
			createNodeArray(type.elementTypes.map(elementType => this.copyType(elementType)))
		);
	}

	/**
	 * Copies a TypeReferenceNode
	 * @param {TypeReferenceNode} type
	 * @returns {TypeReferenceNode}
	 */
	public copyTypeReferenceNode (type: TypeReferenceNode): TypeReferenceNode {
		return createTypeReferenceNode(this.copyEntityName(type.typeName), type.typeArguments == null ? undefined : this.copyTypeArguments(type.typeArguments));
	}

	/**
	 * Copies an IndexedAccessTypeNode
	 * @param {IndexedAccessTypeNode} type
	 * @returns {IndexedAccessTypeNode}
	 */
	public copyIndexedAccessTypeNode (type: IndexedAccessTypeNode): IndexedAccessTypeNode {
		return createIndexedAccessTypeNode(
			this.copyType(type.objectType),
			this.copyType(type.indexType)
		);
	}

	/**
	 * Copies a TypeOperatorNode
	 * @param {TypeOperatorNode} type
	 * @returns {TypeOperatorNode}
	 */
	public copyTypeOperatorNode (type: TypeOperatorNode): TypeOperatorNode {
		return createTypeOperatorNode(this.copyType(type.type));
	}

	/**
	 * Copies a MappedTypeNode
	 * @param {MappedTypeNode} type
	 * @returns {MappedTypeNode}
	 */
	public copyMappedTypeNode (type: MappedTypeNode): MappedTypeNode {
		return createMappedTypeNode(
			type.readonlyToken == null ? undefined : this.copyToken(type.readonlyToken),
			this.copyTypeParameterDeclaration(type.typeParameter),
			type.questionToken == null ? undefined : this.copyToken(type.questionToken),
			type.type == null ? undefined : this.copyType(type.type)
		);
	}

	/**
	 * Copies a FunctionTypeNode
	 * @param {FunctionTypeNode} type
	 * @returns {FunctionTypeNode}
	 */
	public copyFunctionTypeNode (type: FunctionTypeNode): FunctionTypeNode {
		return createFunctionTypeNode(
			type.typeParameters == null ? undefined : type.typeParameters.map(typeParameter => this.copyTypeParameterDeclaration(typeParameter)),
			type.parameters.map(parameter => this.copyParameter(parameter)),
			type.type == null ? undefined : this.copyType(type.type)
		);
	}

	/**
	 * Copies a Parameter
	 * @param {ParameterDeclaration} type
	 * @returns {ParameterDeclaration}
	 */
	public copyParameter (type: ParameterDeclaration): ParameterDeclaration {
		return createParameter(
			type.decorators == null ? undefined : this.copyDecorators(type.decorators),
			type.modifiers == null ? undefined : this.copyModifiers(type.modifiers),
			type.dotDotDotToken == null ? undefined : this.copyToken(type.dotDotDotToken),
			this.copyBindingName(type.name),
			type.questionToken == null ? undefined : this.copyToken(type.questionToken),
			type.type == null ? undefined : this.copyType(type.type),
			type.initializer == null ? undefined : this.copyExpression(type.initializer)
		);
	}

	/**
	 * Copies an ArrayBindingPattern
	 * @param {ArrayBindingPattern} type
	 * @returns {ArrayBindingPattern}
	 */
	public copyArrayBindingPattern (type: ArrayBindingPattern): ArrayBindingPattern {
		return createArrayBindingPattern(this.copyArrayBindingElements(type.elements));
	}

	/**
	 * Copies an ObjectBindingPattern
	 * @param {ObjectBindingPattern} type
	 * @returns {ObjectBindingPattern}
	 */
	public copyObjectBindingPattern (type: ObjectBindingPattern): ObjectBindingPattern {
		return createObjectBindingPattern(this.copyBindingElements(type.elements));
	}

	/**
	 * Copies a BindingElement
	 * @param {BindingElement} type
	 * @returns {BindingElement}
	 */
	public copyBindingElement (type: BindingElement): BindingElement {
		return createBindingElement(
			type.dotDotDotToken == null ? undefined : this.copyToken(type.dotDotDotToken),
			type.propertyName == null ? undefined : this.copyPropertyName(type.propertyName),
			this.copyBindingName(type.name),
			type.initializer == null ? undefined : this.copyExpression(type.initializer)
		);
	}

	/**
	 * Copies a NodeArray of BindingElements
	 * @param {NodeArray<BindingElement>} type
	 * @returns {NodeArray<BindingElement>}
	 */
	public copyBindingElements (type: NodeArray<BindingElement>): NodeArray<BindingElement> {
		return createNodeArray(type.map(element => this.copyBindingElement(element)));
	}

	/**
	 * Copies an OmittedExpression
	 * @returns {OmittedExpression}
	 */
	public copyOmittedExpression (): OmittedExpression {
		return createOmittedExpression();
	}

	/**
	 * Copies an ArrayBindingElement
	 * @param {ArrayBindingElement} type
	 * @returns {ArrayBindingElement}
	 */
	public copyArrayBindingElement (type: ArrayBindingElement): ArrayBindingElement {
		if (isBindingElement(type)) {
			return this.copyBindingElement(type);
		}

		else {
			return this.copyOmittedExpression();
		}
	}

	/**
	 * Copies a NodeArray of ArrayBindingElements
	 * @param {NodeArray<ArrayBindingElement>} type
	 * @returns {NodeArray<ArrayBindingElement>}
	 */
	public copyArrayBindingElements (type: NodeArray<ArrayBindingElement>): NodeArray<ArrayBindingElement> {
		return createNodeArray(type.map(element => this.copyArrayBindingElement(element)));
	}

	/**
	 * Copies a BindingName
	 * @param {BindingName} type
	 * @returns {BindingName}
	 */
	public copyBindingName (type: BindingName): BindingName {
		if (isIdentifier(type)) {
			return this.copyIdentifier(type);
		}

		else if (isArrayBindingPattern(type)) {
			return this.copyArrayBindingPattern(type);
		}

		else {
			return this.copyObjectBindingPattern(type);
		}

	}

	/**
	 * Copies a Decorator
	 * @param {Decorator} type
	 * @returns {Decorator}
	 */
	public copyDecorator (type: Decorator): Decorator {
		return createDecorator(this.copyExpression(type.expression));
	}

	/**
	 * Copies a NodeArray of Decorators
	 * @param {NodeArray<Decorator>} type
	 * @returns {NodeArray<Decorator>}
	 */
	public copyDecorators (type: NodeArray<Decorator>): NodeArray<Decorator> {
		return createNodeArray(type.map(decorator => this.copyDecorator(decorator)));
	}

	/**
	 * Copies a LastTypeNode
	 * @param {LastTypeNode} type
	 * @returns {LastTypeNode}
	 */
	public copyLastTypeNode (type: LastTypeNode): LastTypeNode {
		console.log(type);
		return this.createLastTypeNode(this.copyIdentifier(type.literal));
	}

	/**
	 * Creates a new LastTypeNode
	 * @param {Identifier} literal
	 * @returns {LastTypeNode}
	 */
	public createLastTypeNode (literal: Identifier): LastTypeNode {
		const node = <LastTypeNode> createNode(SyntaxKind.LastTypeNode, -1, -1);
		node.flags |= NodeFlags.Synthesized;
		node.literal = literal;
		return node;
	}

	/**
	 * Copies a KeywordTypeNode
	 * @param {KeywordTypeNode} type
	 * @returns {KeywordTypeNode}
	 */
	public copyKeywordTypeNode (type: KeywordTypeNode): KeywordTypeNode {
		return createKeywordTypeNode(type.kind);
	}

	/**
	 * Copies a TypeLiteralNode
	 * @param {TypeLiteralNode} type
	 * @returns {TypeLiteralNode}
	 */
	public copyTypeLiteralNode (type: TypeLiteralNode): TypeLiteralNode {
		return createTypeLiteralNode(
			createNodeArray(type.members.map(member => this.copyTypeElement(member)))
		);
	}

	/**
	 * Copies a UnionType
	 * @param {UnionTypeNode} type
	 * @returns {UnionTypeNode}
	 */
	public copyUnionTypeNode (type: UnionTypeNode): UnionTypeNode {
		return createUnionTypeNode(type.types.map(unionType => this.copyType(unionType)));
	}

	/**
	 * Copies an IntersectionType
	 * @param {IntersectionTypeNode} type
	 * @returns {IntersectionTypeNode}
	 */
	public copyIntersectionTypeNode (type: IntersectionTypeNode): IntersectionTypeNode {
		return createIntersectionTypeNode(type.types.map(intersectionType => this.copyType(intersectionType)));
	}

	/**
	 * Copies an ArrayTypeNode
	 * @param {ArrayTypeNode} type
	 * @returns {ArrayTypeNode}
	 */
	public copyArrayTypeNode (type: ArrayTypeNode): ArrayTypeNode {
		return createArrayTypeNode(this.copyType(type.elementType));
	}

	/**
	 * Copies a PropertyName
	 * @param {PropertyName} type
	 * @returns {PropertyName}
	 */
	public copyPropertyName (type: PropertyName): PropertyName {
		if (isIdentifier(type)) {
			return this.copyIdentifier(type);
		}

		else if (isStringLiteral(type)) {
			return this.copyStringLiteral(type);
		}

		else if (isNumericLiteral(type)) {
			return this.copyNumericLiteral(type);
		}

		else {
			return this.copyComputedPropertyName(type);
		}
	}

	/**
	 * Copies a ComputedPropertyName
	 * @param {ComputedPropertyName} type
	 * @returns {ComputedPropertyName}
	 */
	public copyComputedPropertyName (type: ComputedPropertyName): ComputedPropertyName {
		return createComputedPropertyName(this.copyExpression(type.expression));
	}

	/**
	 * Copies a StringLiteral
	 * @param {StringLiteral} type
	 * @returns {StringLiteral}
	 */
	public copyStringLiteral (type: StringLiteral): StringLiteral {
		return createLiteral(type.text);
	}

	/**
	 * Copies a NumericLiteral
	 * @param {NumericLiteral} type
	 * @returns {NumericLiteral}
	 */
	public copyNumericLiteral (type: NumericLiteral): NumericLiteral {
		return createNumericLiteral(type.text);
	}

	/**
	 * Copies a BooleanLiteral
	 * @param {BooleanLiteral} type
	 * @returns {BooleanLiteral}
	 */
	public copyBooleanLiteral (type: BooleanLiteral): BooleanLiteral {
		return type.kind === SyntaxKind.TrueKeyword ? createTrue() : createFalse();
	}

	/**
	 * Copies a TypeElement
	 * @param {TypeElement} type
	 * @returns {TypeElement}
	 */
	public copyTypeElement (type: TypeElement): TypeElement {
		if (isPropertySignature(type)) {
			return this.copyPropertySignature(type);
		}

		else if (isStringLiteral(type)) {
			// The Typescript typings don't think literals are TypeElements - but they sure can be
			return <TypeElement> </*tslint:disable*/any/*tslint:disable*/> this.copyStringLiteral(type);
		}

		else if (isNumericLiteral(type)) {
			// The Typescript typings don't think literals are TypeElements - but they sure can be
			return <TypeElement> </*tslint:disable*/any/*tslint:disable*/> this.copyNumericLiteral(type);
		}

		throw new TypeError(`${this.constructor.name} could not copy a TypeElement of kind: ${SyntaxKind[type.kind]}`);
	}

	/**
	 * Copies a PropertySignature
	 * @param {PropertySignature} type
	 * @returns {PropertySignature}
	 */
	public copyPropertySignature (type: PropertySignature): PropertySignature {
		return createPropertySignature(
			type.modifiers == null ? undefined : this.copyModifiers(type.modifiers),
			this.copyPropertyName(type.name),
			type.questionToken == null ? undefined : this.copyToken(type.questionToken),
			type.type == null ? undefined : this.copyType(type.type),
			type.initializer == null ? undefined : this.copyExpression(type.initializer)
		);
	}

	/**
	 * Copies a NodeArray of TypeParameterDeclarations
	 * @param {NodeArray<TypeParameterDeclaration>} type
	 * @returns {NodeArray<TypeParameterDeclaration>}
	 */
	public copyTypeParameterDeclarations (type: NodeArray<TypeParameterDeclaration>): NodeArray<TypeParameterDeclaration> {
		return createNodeArray(type.map(typeArgument => this.copyTypeParameterDeclaration(typeArgument)));
	}

	/**
	 * Copies a TypeParameterDeclaration
	 * @param {TypeParameterDeclaration} type
	 * @returns {TypeParameterDeclaration}
	 */
	public copyTypeParameterDeclaration (type: TypeParameterDeclaration): TypeParameterDeclaration {
		return createTypeParameterDeclaration(
			this.copyIdentifier(type.name),
			type.constraint == null ? undefined : this.copyType(type.constraint),
			type.default == null ? undefined : this.copyType(type.default
			));
	}

	/**
	 * Copies a NodeArray of TypeArguments
	 * @param {NodeArray<TypeNode>} type
	 * @returns {NodeArray<TypeNode>}
	 */
	public copyTypeArguments (type: NodeArray<TypeNode>): NodeArray<TypeNode> {
		return createNodeArray(type.map(typeArgument => this.copyType(typeArgument)));
	}

	/**
	 * Copies a NodeArray of HeritageClauses
	 * @param {NodeArray<HeritageClause>} type
	 * @returns {NodeArray<HeritageClause>}
	 */
	public copyHeritageClauses (type: NodeArray<HeritageClause>): NodeArray<HeritageClause> {
		return createNodeArray(type.map(clause => this.copyHeritageClause(clause)));
	}

	/**
	 * Copies a HeritageClause
	 * @param {HeritageClause} type
	 * @returns {HeritageClause}
	 */
	public copyHeritageClause (type: HeritageClause): HeritageClause {
		return createHeritageClause(type.token, this.copyExpressionsWithTypeArguments(type.types));
	}

	/**
	 * Copies a NodeArray of Modifiers
	 * @param {NodeArray<Modifier>} type
	 * @returns {NodeArray<Modifier>}
	 */
	public copyModifiers (type: NodeArray<Modifier>): NodeArray<Modifier> {
		return createNodeArray(type.map(modifier => this.copyModifier(modifier)));
	}

	/**
	 * Copies a Modifier
	 * @param {Modifier} type
	 * @returns {Modifier}
	 */
	public copyModifier (type: Modifier): Modifier {
		return <Modifier> createToken(type.kind);
	}

	/**
	 * Copies an Expression
	 * @param {Expression} type
	 * @returns {Expression}
	 */
	public copyExpression (type: Expression): Expression {
		if (isIdentifier(type)) {
			return this.copyIdentifier(type);
		}

		else if (isStringLiteral(type)) {
			return this.copyStringLiteral(type);
		}

		else if (isNumericLiteral(type)) {
			return this.copyNumericLiteral(type);
		}

		else if (isBooleanLiteral(type)) {
			return this.copyBooleanLiteral(type);
		}

		throw new ReferenceError(`${this.constructor.name} could not copy an expression of kind: ${SyntaxKind[type.kind]}`);
	}

	/**
	 * Copies an Identifier
	 * @param {Identifier} type
	 * @returns {Identifier}
	 */
	public copyIdentifier (type: Identifier): Identifier {
		return createIdentifier(type.text);
	}

	/**
	 * Copies an EntityName
	 * @param {EntityName} type
	 * @returns {EntityName}
	 */
	public copyEntityName (type: EntityName): EntityName {
		return isQualifiedName(type) ? this.copyQualifiedName(type) : this.copyIdentifier(type);
	}

	/**
	 * Copies a QualifiedName
	 * @param {QualifiedName} type
	 * @returns {QualifiedName}
	 */
	public copyQualifiedName (type: QualifiedName): QualifiedName {
		return createQualifiedName(
			this.copyEntityName(type.left),
			this.copyIdentifier(type.right)
		);
	}

	/**
	 * Copies a Token
	 * @param {Token<TKind extends SyntaxKind>} type
	 * @returns {Token<TKind extends SyntaxKind>}
	 */
	public copyToken<TKind extends SyntaxKind> (type: Token<TKind>): Token<TKind> {
		return createToken(type.kind);
	}

	/**
	 * Copies a NodeArray of ExpressionWithTypeArguments
	 * @param {NodeArray<ExpressionWithTypeArguments>} type
	 * @returns {NodeArray<ExpressionWithTypeArguments>}
	 */
	public copyExpressionsWithTypeArguments (type: NodeArray<ExpressionWithTypeArguments>): NodeArray<ExpressionWithTypeArguments> {
		return createNodeArray(type.map(expression => this.copyExpressionWithTypeArguments(expression)));
	}

	/**
	 * Copies an ExpressionWithTypeArguments
	 * @param {ExpressionWithTypeArguments} type
	 * @returns {ExpressionWithTypeArguments}
	 */
	public copyExpressionWithTypeArguments (type: ExpressionWithTypeArguments): ExpressionWithTypeArguments {
		return createExpressionWithTypeArguments(
			type.typeArguments == null ? createNodeArray() : this.copyTypeArguments(type.typeArguments),
			this.copyExpression(type.expression)
		);
	}
}