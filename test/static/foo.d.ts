import {IFileLoader} from "@wessberg/fileloader";
import {IModuleUtil} from "@wessberg/moduleutil";
import {IPathUtil} from "@wessberg/pathutil";
import {ITypescriptLanguageService, ITypescriptLanguageServiceAddFileOptions} from "@wessberg/typescript-language-service";
import {IGetFileOptions} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-get-file-options";
import {ITypescriptLanguageServiceAddImportedFiles} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-typescript-language-service-add-imported-files";
import {ITypescriptLanguageServiceAddPath} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-typescript-language-service-add-path";
import {ITypescriptLanguageServiceContent} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-typescript-language-service-content";
import {ITypescriptLanguageServiceGetPathInfoOptions} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-typescript-language-service-get-path-info-options";
import {ITypescriptLanguageServiceImportPath} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-typescript-language-service-import-path";
import {ITypescriptLanguageServiceOptions} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-typescript-language-service-options";
import {ITypescriptLanguageServicePathInfo} from "@wessberg/typescript-language-service/dist/es2015/typescript-language-service/i-typescript-language-service-path-info";
import {ITypescriptPackageReassembler} from "@wessberg/typescript-package-reassembler";
import {CompilerOptions, DefinitionInfo, ImplementationLocation, IScriptSnapshot, Node, QuickInfo, ReferencedSymbol, SourceFile} from "typescript";

/**
 * A host-implementation of Typescripts LanguageService.
 * @author Frederik Wessberg
 */
export declare class TypescriptLanguageService implements ITypescriptLanguageService {
	/**
	 * A suffix to temporarily append to .d.ts files
	 * @type {string}
	 */
	private static readonly DECLARATION_TEMPORARY_SUFFIX;
	/**
	 * A Map between paths and their resolved paths
	 * @type {Map<string, ITypescriptLanguageServiceAddPath>}
	 */
	private static readonly RESOLVED_PATH_MAP;
	/**
	 * The default compiler options to use
	 * @type {CompilerOptions}
	 */
	private static readonly DEFAULT_COMPILER_OPTIONS;
	private moduleUtil;
	private pathUtil;
	private fileLoader;
	private reassembler;
	/**
	 * The Set of all Regular Expressions for matching files to be excluded
	 * @type {Set<RegExp>}
	 */
	private excludedFiles;
	/**
	 * A Map between filenames and their current version and content in the AST.
	 * @type {Map<string, ITypescriptLanguageServiceFile>}
	 */
	private files;
	/**
	 * The (Typescript) TypescriptLanguageService to use under-the-hood.
	 * @type {LanguageService}
	 */
	private languageService;
	/**
	 * The actual CompilerOptions to use
	 * @type {CompilerOptions}
	 */
	private compilerOptions;
	/**
	 * Returns the part that will be added to any temporary declaration file
	 * @returns {string}
	 */
	private readonly temporaryDeclarationAddition;

	constructor (moduleUtil: IModuleUtil, pathUtil: IPathUtil, fileLoader: IFileLoader, reassembler: ITypescriptPackageReassembler);

	/**
	 * Sets options for the TypescriptLanguageService
	 * @param {Partial<ITypescriptLanguageServiceOptions>} options
	 */
	public setOptions (options?: Partial<ITypescriptLanguageServiceOptions>): void;

	/**
	 * Excludes files from the compiler that matches the provided Regular Expression(s)
	 * @param {RegExp | Iterable<RegExp>} match
	 */
	public excludeFiles (match: RegExp | Iterable<RegExp>): void;

	/**
	 * Gets relevant path info
	 * @param {(ITypescriptLanguageServiceGetPathInfoOptions & {content?: string}) | (ITypescriptLanguageServiceAddPath & {content?: string})} options
	 * @returns {ITypescriptLanguageServicePathInfo}
	 */
	public getPathInfo (options: (ITypescriptLanguageServiceGetPathInfoOptions & {
		content?: string;
	}) | (ITypescriptLanguageServiceAddPath & {
		content?: string;
	})): ITypescriptLanguageServicePathInfo;

	/**
	 * Gets info about the path that will be added to Typescript's AST
	 * @param {string} path
	 * @param {string} from
	 * @returns {ITypescriptLanguageServiceAddPath}
	 */
	public getAddPath (path: string, from?: string): ITypescriptLanguageServiceAddPath;

	/**
	 * Adds a new file to the TypescriptLanguageService.
	 * @param {ITypescriptLanguageServiceAddFileOptions & ITypescriptLanguageServiceAddImportedFiles | ITypescriptLanguageServicePathInfo & ITypescriptLanguageServiceAddImportedFiles} options
	 * @returns {SourceFile}
	 */
	public addFile (options: (ITypescriptLanguageServiceAddFileOptions & ITypescriptLanguageServiceAddImportedFiles) | (ITypescriptLanguageServicePathInfo & ITypescriptLanguageServiceAddImportedFiles)): SourceFile;

	/**
	 * Gets the Statements associated with the given filename.
	 * @param {IGetFileOptions} options
	 * @returns {SourceFile}
	 */
	public getFile ({path, content, from}: IGetFileOptions): SourceFile;

	/**
	 * Removes a file from the TypescriptLanguageService.
	 * @param {string} fileName
	 * @returns {void}
	 */
	public removeFile (fileName: string): void;

	/**
	 * Gets the settings that Typescript will generate an AST from.
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
	 * @returns {ITypescriptLanguageServiceContent}
	 */
	public getFileContent (fileName: string): ITypescriptLanguageServiceContent;

	/**
	 * Gets the last registered IScriptSnapshot, if any, otherwise undefined.
	 * @param {string} fileName
	 * @returns {IScriptSnapshot?}
	 */
	public getScriptSnapshot (fileName: string): IScriptSnapshot | undefined;

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
	 * @param {Node} statement
	 * @returns {DefinitionInfo[]}
	 */
	public getDefinitionAtStatement (statement: Node): DefinitionInfo[];

	/**
	 * Gets the Type DefinitionInfo at the provided position in the given file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {DefinitionInfo[]}
	 */
	public getTypeDefinitionAtPosition (filename: string, position: number): DefinitionInfo[];

	/**
	 * Gets the Type DefinitionInfo at the position of the provided Statement.
	 * @param {Node} statement
	 * @returns {DefinitionInfo[]}
	 */
	public getTypeDefinitionAtStatement (statement: Node): DefinitionInfo[];

	/**
	 * Finds all references for the identifier on the provided position in the provided file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {ReferencedSymbol[]}
	 */
	public findReferencesForPosition (filename: string, position: number): ReferencedSymbol[];

	/**
	 * Finds all references for the identifier associated with the provided Statement.
	 * @param {Node} statement
	 * @returns {ReferencedSymbol[]}
	 */
	public findReferencesForStatement (statement: Node): ReferencedSymbol[];

	/**
	 * Gets QuickInfo for the provided file on the provided position
	 * @param {string} filename
	 * @param {number} position
	 * @returns {QuickInfo}
	 */
	public getQuickInfoAtPosition (filename: string, position: number): QuickInfo;

	/**
	 * Gets QuickInfo for the provided statement
	 * @param {Node} statement
	 * @returns {ImplementationLocation[]}
	 */
	public getQuickInfoForStatement (statement: Node): QuickInfo;

	/**
	 * Gets the implementation for the interface located on the given position in the given file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {ImplementationLocation[]}
	 */
	public getImplementationAtPosition (filename: string, position: number): ImplementationLocation[];

	/**
	 * Gets the implementation for the interface associated with the given Statement,
	 * @param {Node} statement
	 * @returns {ImplementationLocation[]}
	 */
	public getImplementationForStatement (statement: Node): ImplementationLocation[];

	/**
	 * Gets all imported files for the given file
	 * @param {string} filename
	 * @returns {ITypescriptLanguageServiceImportPath[]}
	 */
	public getImportedFilesForFile (filename: string): ITypescriptLanguageServiceImportPath[];

	/**
	 * Gets all imported files for the file that has the provided Statement.
	 * @param {Node} statement
	 * @returns {ITypescriptLanguageServiceImportPath[]}
	 */
	public getImportedFilesForStatementFile (statement: Node): ITypescriptLanguageServiceImportPath[];

	/**
	 * Gets all imported files for the given content
	 * @param {string} content
	 * @param {string} from
	 * @returns {ITypescriptLanguageServiceImportPath[]}
	 */
	public getImportedFilesForContent (content: string, from: string): ITypescriptLanguageServiceImportPath[];

	/**
	 * Sets the compiler options to use
	 * @param {CompilerOptions} options
	 */
	private setCompilerOptions (options);

	/**
	 * Loads the file contents from the provided addPath
	 * @param {boolean} isTemporary
	 * @param {string} resolvedPath
	 * @param {string} normalizedPath
	 * @returns {string}
	 */
	private loadContent ({isTemporary, resolvedPath, normalizedPath});

	/**
	 * Returns true if the given filepath should be excluded
	 * @param {string} filepath
	 * @returns {boolean}
	 */
	private isExcluded (filepath);

	/**
	 * Reassembles a compiled .js file (though normalized with a .ts extension) with a matching declaration file (.d.ts)
	 * to re-add "lost" type information after publishing to NPM.
	 * @param {string} normalizedPath
	 * @param {string} normalizedContent
	 * @param {string} declarationPath
	 * @returns {string}
	 */
	private reassemble (normalizedPath, normalizedContent, declarationPath);

	/**
	 * Clears the part of a path that has been added as a temporary declaration
	 * @param {string} path
	 * @returns {string}
	 */
	private clearTemporaryDeclarationAddition (path);

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
}
