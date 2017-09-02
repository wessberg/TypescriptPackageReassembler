import {TypeNode, KeywordTypeNode, SyntaxKind} from "typescript";

/**
 * Returns true if the given item is a KeywordTypeNode
 * @param {TypeNode} item
 * @returns {boolean}
 */
export function isKeywordTypeNode (item: TypeNode): item is KeywordTypeNode {
	return (
		item.kind === SyntaxKind.AnyKeyword ||
		item.kind === SyntaxKind.NumberKeyword ||
		item.kind === SyntaxKind.ObjectKeyword ||
		item.kind === SyntaxKind.BooleanKeyword ||
		item.kind === SyntaxKind.StringKeyword ||
		item.kind === SyntaxKind.SymbolKeyword ||
		item.kind === SyntaxKind.ThisKeyword ||
		item.kind === SyntaxKind.VoidKeyword ||
		item.kind === SyntaxKind.UndefinedKeyword ||
		item.kind === SyntaxKind.NullKeyword ||
		item.kind === SyntaxKind.NeverKeyword
	);
}