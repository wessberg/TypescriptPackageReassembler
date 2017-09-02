import {CompilerOptions, DefinitionInfo, Expression, ImplementationLocation, IScriptSnapshot, Node, NodeArray, ReferencedSymbol, Statement} from "typescript";
import {IModuleUtil} from "@wessberg/moduleutil";
import {IFileLoader} from "@wessberg/fileloader";
import {IPathUtil} from "@wessberg/pathutil";
import {ITypescriptLanguageService, ITypescriptLanguageServiceAddFileOptions, ITypescriptLanguageServiceGetFileOptions} from "@wessberg/typescript-language-service";
import {ITypescriptLanguageServiceOptions} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-typescript-language-service-options";

/**
 * A host-implementation of Typescripts LanguageService.
 * @author Frederik Wessberg
 */
export declare class TypescriptLanguageService implements ITypescriptLanguageService {
	private moduleUtil;
	private pathUtil;
	private fileLoader;
	/**
	 * The Set of all Regular Expressions for matching files to be excluded
	 * @type {Set<RegExp>}
	 */
	private excludedFiles;
	/**
	 * A Map between filenames and their current version and content in the AST.
	 * @type {Map<string, {version: number, content: string}>}
	 */
	private files;
	/**
	 * The (Typescript) TypescriptLanguageService to use under-the-hood.
	 * @type {LanguageService}
	 */
	private languageService;

	constructor (moduleUtil: IModuleUtil, pathUtil: IPathUtil, fileLoader: IFileLoader, options?: Partial<ITypescriptLanguageServiceOptions>);

	/**
	 * Excludes files from the compiler that matches the provided Regular Expression(s)
	 * @param {RegExp | Iterable<RegExp>} match
	 */
	public excludeFiles (match: RegExp|Iterable<RegExp>): void;

	/**
	 * Adds a new file to the TypescriptLanguageService.
	 * @param {string} path
	 * @param {string} from
	 * @param {string} [content]
	 * @param {number} [version]
	 * @param {boolean} [addImportedFiles]
	 * @returns {NodeArray<Statement>}
	 */
	public addFile ({path, from, content, addImportedFiles}: ITypescriptLanguageServiceAddFileOptions): NodeArray<Statement>;

	/**
	 * Gets the Statements associated with the given filename.
	 * @param {string} path
	 * @param {string} [from]
	 * @returns {NodeArray<Statement>}
	 */
	public getFile ({path, from}: ITypescriptLanguageServiceGetFileOptions): NodeArray<Statement>;

	/**
	 * Removes a file from the TypescriptLanguageService.
	 * @param {string} fileName
	 * @returns {void}
	 */
	public removeFile (fileName: string): void;

	/**
	 * Gets the settings that Typescript will generate an AST from. There isn't much reason to make
	 * anything but the libs developer-facing since we only support ES2015 (and newer) modules.
	 * @returns {CompilerOptions}
	 */
	public getCompilationSettings (): CompilerOptions;

	/**
	 * Gets the names of each file that has been added to the "program".
	 * @returns {string[]}
	 */
	public getScriptFileNames (): string[];

	/**
	 * Gets the last version of the given fileName. Each time a file changes, the version number will be updated,
	 * so this can be useful to figure out if the file has changed since the program was run initially.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getScriptVersion (fileName: string): string;

	/**
	 * Gets the current version of the given filepath in the Typescript AST.
	 * @param {string} filePath
	 * @returns {number}
	 */
	public getFileVersion (filePath: string): number;

	/**
	 * Gets the last contents of the given filename.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getFileContent (fileName: string): string;

	/**
	 * Gets the last registered IScriptSnapshot, if any, otherwise undefined.
	 * @param {string} fileName
	 * @returns {IScriptSnapshot?}
	 */
	public getScriptSnapshot (fileName: string): IScriptSnapshot|undefined;

	/**
	 * Gets the current directory.
	 * @returns {string}
	 */
	public getCurrentDirectory (): string;

	/**
	 * Gets the default filepath for Typescript's lib-files.
	 * @param {CompilerOptions} options
	 * @returns {string}
	 */
	public getDefaultLibFileName (options: CompilerOptions): string;

	/**
	 * Gets the DefinitionInfo at the provided position in the given file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {DefinitionInfo[]}
	 */
	public getDefinitionAtPosition (filename: string, position: number): DefinitionInfo[];

	/**
	 * Gets the DefinitionInfo for the provided Statement
	 * @param {Statement | Expression | Node} statement
	 * @returns {DefinitionInfo[]}
	 */
	public getDefinitionAtStatement (statement: Statement|Expression|Node): DefinitionInfo[];

	/**
	 * Gets the Type DefinitionInfo at the provided position in the given file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {DefinitionInfo[]}
	 */
	public getTypeDefinitionAtPosition (filename: string, position: number): DefinitionInfo[];

	/**
	 * Gets the Type DefinitionInfo at the position of the provided Statement.
	 * @param {Statement | Expression | Node} statement
	 * @returns {DefinitionInfo[]}
	 */
	public getTypeDefinitionAtStatement (statement: Statement|Expression|Node): DefinitionInfo[];

	/**
	 * Finds all references for the identifier on the provided position in the provided file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {ReferencedSymbol[]}
	 */
	public findReferencesForPosition (filename: string, position: number): ReferencedSymbol[];

	/**
	 * Finds all references for the identifier associated with the provided Statement.
	 * @param {Statement | Expression | Node} statement
	 * @returns {ReferencedSymbol[]}
	 */
	public findReferencesForStatement (statement: Statement|Expression|Node): ReferencedSymbol[];

	/**
	 * Gets the implementation for the interface located on the given position in the given file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {ImplementationLocation[]}
	 */
	public getImplementationAtPosition (filename: string, position: number): ImplementationLocation[];

	/**
	 * Gets the implementation for the interface associated with the given Statement,
	 * @param {Statement | Expression | Node} statement
	 * @returns {ImplementationLocation[]}
	 */
	public getImplementationForStatement (statement: Statement|Expression|Node): ImplementationLocation[];

	/**
	 * Gets all imported files for the given file
	 * @param {string} filename
	 * @returns {string[]}
	 */
	public getImportedFilesForFile (filename: string): string[];

	/**
	 * Gets all imported files for the file that has the provided Statement.
	 * @param {Statement | Expression | Node} statement
	 * @returns {string[]}
	 */
	public getImportedFilesForStatementFile (statement: Statement|Expression|Node): string[];

	/**
	 * Gets all imported files for the given content
	 * @param {string} content
	 * @param {string} from
	 * @returns {string[]}
	 */
	public getImportedFilesForContent (content: string, from: string): string[];

	/**
	 * Returns true if the given filepath should be excluded
	 * @param {string} filepath
	 * @returns {boolean}
	 */
	private isExcluded (filepath);

	/**
	 * Returns true if the provided file needs to be updated. Essentially, this comes down to whether or not the content has changed.
	 * @param {string} filePath
	 * @param {string} content
	 * @returns {boolean}
	 */
	private needsUpdate (filePath, content);

	/**
	 * Makes sure that the provided filePath ends with ".ts", unless it is already an absolute path
	 * @param {string} filePath
	 * @returns {string}
	 */
	private normalizeExtension (filePath);

	/**
	 * Resolves the path to a module. It may return an empty string if the path doesn't exist
	 * @param {string} filePath
	 * @param {string} [from]
	 * @returns {string}
	 */
	private resolvePath (filePath, from?);

	/**
	 * Resolves the path to a module and sets a '.ts' extension on it.
	 * @param {string} filePath
	 * @param {string} from
	 * @returns {string}
	 */
	private resolveAndNormalize (filePath, from?);
}
