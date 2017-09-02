import { createDocumentRegistry, createLanguageService, createNodeArray, getDefaultLibFilePath, ModuleKind, preProcessFile, ScriptSnapshot, ScriptTarget } from "typescript";
/**
 * A host-implementation of Typescripts LanguageService.
 * @author Frederik Wessberg
 */
export class TypescriptLanguageService {
	constructor(moduleUtil, pathUtil, fileLoader, options) {
		this.moduleUtil = moduleUtil;
		this.pathUtil = pathUtil;
		this.fileLoader = fileLoader;
		/**
		 * The Set of all Regular Expressions for matching files to be excluded
		 * @type {Set<RegExp>}
		 */
		this.excludedFiles = new Set();
		/**
		 * A Map between filenames and their current version and content in the AST.
		 * @type {Map<string, {version: number, content: string}>}
		 */
		this.files = new Map();
		/**
		 * The (Typescript) TypescriptLanguageService to use under-the-hood.
		 * @type {LanguageService}
		 */
		this.languageService = createLanguageService(this, createDocumentRegistry());
		if (options != null && options.excludedFiles != null) {
			this.excludeFiles(options.excludedFiles);
		}
	}
	/**
	 * Excludes files from the compiler that matches the provided Regular Expression(s)
	 * @param {RegExp | Iterable<RegExp>} match
	 */
	excludeFiles(match) {
		if (match instanceof RegExp)
			this.excludedFiles.add(match);
		else
			[...match].forEach(regExpItem => this.excludedFiles.add(regExpItem));
	}
	/**
	 * Returns true if the given filepath should be excluded
	 * @param {string} filepath
	 * @returns {boolean}
	 */
	isExcluded(filepath) {
		return [...this.excludedFiles].some(regex => regex.test(filepath));
	}
	/**
	 * Adds a new file to the TypescriptLanguageService.
	 * @param {string} path
	 * @param {string} from
	 * @param {string} [content]
	 * @param {number} [version]
	 * @param {boolean} [addImportedFiles]
	 * @returns {NodeArray<Statement>}
	 */
	addFile({ path, from = process.cwd(), content, addImportedFiles }) {
		try {
			// Resolve the absolute, fully qualified path
			const resolvedPath = this.moduleUtil.resolvePath(path, from);
			const normalizedPath = this.normalizeExtension(resolvedPath);
			// Load the contents from the absolute path unless content was given as an argument
			const actualContent = content == null ? this.fileLoader.loadSync(resolvedPath).toString() : content;
			// Only actually update the file if it has changed.
			if (this.needsUpdate(resolvedPath, actualContent)) {
				// Bump the script version
				const actualVersion = this.getFileVersion(resolvedPath) + 1;
				// Store it as a parsed file
				this.files.set(normalizedPath, { version: actualVersion, content: actualContent });
				// Recursively add all missing imports to the LanguageService if 'addImportedFiles' is truthy.
				if (addImportedFiles != null && addImportedFiles)
					this.getImportedFilesForFile(resolvedPath).forEach(importedFile => {
						if (!this.isExcluded(importedFile))
							this.addFile({ path: importedFile, from: resolvedPath, addImportedFiles });
					});
			}
			// Retrieve the Statements of the file
			return this.getFile({ path: resolvedPath, from });
		}
		catch (ex) {
			// A module attempted to load a file or a module which doesn't exist. Return an empty array.
			return createNodeArray();
		}
	}
	/**
	 * Gets the Statements associated with the given filename.
	 * @param {string} path
	 * @param {string} [from]
	 * @returns {NodeArray<Statement>}
	 */
	getFile({ path, from = process.cwd() }) {
		// Resolve the absolute, fully qualified path
		const file = this.languageService.getProgram().getSourceFile(this.resolveAndNormalize(path, from));
		if (file == null)
			return createNodeArray();
		return file == null ? createNodeArray() : file.statements;
	}
	/**
	 * Removes a file from the TypescriptLanguageService.
	 * @param {string} fileName
	 * @returns {void}
	 */
	removeFile(fileName) {
		this.files.delete(fileName);
	}
	/**
	 * Gets the settings that Typescript will generate an AST from. There isn't much reason to make
	 * anything but the libs developer-facing since we only support ES2015 (and newer) modules.
	 * @returns {CompilerOptions}
	 */
	getCompilationSettings() {
		return {
			target: ScriptTarget.ES2017,
			module: ModuleKind.ESNext,
			lib: ["es2015.promise", "dom", "es6", "scripthost", "es7", "es2017.object", "es2015.proxy"]
		};
	}
	/**
	 * Gets the names of each file that has been added to the "program".
	 * @returns {string[]}
	 */
	getScriptFileNames() {
		return [...this.files.keys()];
	}
	/**
	 * Gets the last version of the given fileName. Each time a file changes, the version number will be updated,
	 * so this can be useful to figure out if the file has changed since the program was run initially.
	 * @param {string} fileName
	 * @returns {string}
	 */
	getScriptVersion(fileName) {
		const script = this.files.get(fileName);
		if (script == null)
			return "-1";
		return script.version.toString();
	}
	/**
	 * Gets the current version of the given filepath in the Typescript AST.
	 * @param {string} filePath
	 * @returns {number}
	 */
	getFileVersion(filePath) {
		const version = this.getScriptVersion(this.resolveAndNormalize(filePath));
		return parseInt(version);
	}
	/**
	 * Gets the last contents of the given filename.
	 * @param {string} fileName
	 * @returns {string}
	 */
	getFileContent(fileName) {
		const script = this.files.get(this.resolveAndNormalize(fileName));
		if (script == null)
			return "";
		return script.content.toString();
	}
	/**
	 * Gets the last registered IScriptSnapshot, if any, otherwise undefined.
	 * @param {string} fileName
	 * @returns {IScriptSnapshot?}
	 */
	getScriptSnapshot(fileName) {
		const file = this.files.get(this.resolveAndNormalize(fileName));
		if (file == null)
			return undefined;
		return ScriptSnapshot.fromString(file.content);
	}
	/**
	 * Gets the current directory.
	 * @returns {string}
	 */
	getCurrentDirectory() {
		return process.cwd();
	}
	/**
	 * Gets the default filepath for Typescript's lib-files.
	 * @param {CompilerOptions} options
	 * @returns {string}
	 */
	getDefaultLibFileName(options) {
		return getDefaultLibFilePath(options);
	}
	/**
	 * Gets the DefinitionInfo at the provided position in the given file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {DefinitionInfo[]}
	 */
	getDefinitionAtPosition(filename, position) {
		const actualFilePath = this.resolveAndNormalize(filename);
		return this.languageService.getDefinitionAtPosition(actualFilePath, position);
	}
	/**
	 * Gets the DefinitionInfo for the provided Statement
	 * @param {Statement | Expression | Node} statement
	 * @returns {DefinitionInfo[]}
	 */
	getDefinitionAtStatement(statement) {
		const filePath = statement.getSourceFile().fileName;
		const position = statement.pos;
		return this.languageService.getDefinitionAtPosition(filePath, position);
	}
	/**
	 * Gets the Type DefinitionInfo at the provided position in the given file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {DefinitionInfo[]}
	 */
	getTypeDefinitionAtPosition(filename, position) {
		const actualFilePath = this.resolveAndNormalize(filename);
		return this.languageService.getTypeDefinitionAtPosition(actualFilePath, position);
	}
	/**
	 * Gets the Type DefinitionInfo at the position of the provided Statement.
	 * @param {Statement | Expression | Node} statement
	 * @returns {DefinitionInfo[]}
	 */
	getTypeDefinitionAtStatement(statement) {
		const filePath = statement.getSourceFile().fileName;
		const position = statement.pos;
		return this.languageService.getTypeDefinitionAtPosition(filePath, position);
	}
	/**
	 * Finds all references for the identifier on the provided position in the provided file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {ReferencedSymbol[]}
	 */
	findReferencesForPosition(filename, position) {
		const actualFilePath = this.resolveAndNormalize(filename);
		return this.languageService.findReferences(actualFilePath, position);
	}
	/**
	 * Finds all references for the identifier associated with the provided Statement.
	 * @param {Statement | Expression | Node} statement
	 * @returns {ReferencedSymbol[]}
	 */
	findReferencesForStatement(statement) {
		const filePath = statement.getSourceFile().fileName;
		const position = statement.pos;
		return this.languageService.findReferences(filePath, position);
	}
	/**
	 * Gets the implementation for the interface located on the given position in the given file
	 * @param {string} filename
	 * @param {number} position
	 * @returns {ImplementationLocation[]}
	 */
	getImplementationAtPosition(filename, position) {
		const actualFilePath = this.resolveAndNormalize(filename);
		return this.languageService.getImplementationAtPosition(actualFilePath, position);
	}
	/**
	 * Gets the implementation for the interface associated with the given Statement,
	 * @param {Statement | Expression | Node} statement
	 * @returns {ImplementationLocation[]}
	 */
	getImplementationForStatement(statement) {
		const filePath = statement.getSourceFile().fileName;
		const position = statement.pos;
		return this.languageService.getImplementationAtPosition(filePath, position);
	}
	/**
	 * Gets all imported files for the given file
	 * @param {string} filename
	 * @returns {string[]}
	 */
	getImportedFilesForFile(filename) {
		const content = this.getFileContent(filename);
		return this.getImportedFilesForContent(content, filename);
	}
	/**
	 * Gets all imported files for the file that has the provided Statement.
	 * @param {Statement | Expression | Node} statement
	 * @returns {string[]}
	 */
	getImportedFilesForStatementFile(statement) {
		return this.getImportedFilesForFile(statement.getSourceFile().fileName);
	}
	/**
	 * Gets all imported files for the given content
	 * @param {string} content
	 * @param {string} from
	 * @returns {string[]}
	 */
	getImportedFilesForContent(content, from) {
		return preProcessFile(content, true, true).importedFiles
			.map(importedFile => this.resolvePath(importedFile.fileName, from))
			.filter(path => path != null && path.length > 0 && !this.moduleUtil.builtInModules.has(path));
	}
	/**
	 * Returns true if the provided file needs to be updated. Essentially, this comes down to whether or not the content has changed.
	 * @param {string} filePath
	 * @param {string} content
	 * @returns {boolean}
	 */
	needsUpdate(filePath, content) {
		const oldContent = this.getFileContent(filePath);
		return !(content === oldContent);
	}
	/**
	 * Makes sure that the provided filePath ends with ".ts", unless it is already an absolute path
	 * @param {string} filePath
	 * @returns {string}
	 */
	normalizeExtension(filePath) {
		return this.pathUtil.setExtension(filePath, ".ts");
	}
	/**
	 * Resolves the path to a module. It may return an empty string if the path doesn't exist
	 * @param {string} filePath
	 * @param {string} [from]
	 * @returns {string}
	 */
	resolvePath(filePath, from) {
		if (filePath.endsWith(".ts") || filePath.endsWith(".tsx"))
			return filePath;
		try {
			return this.moduleUtil.resolvePath(filePath, from);
		}
		catch (ex) {
			return "";
		}
	}
	/**
	 * Resolves the path to a module and sets a '.ts' extension on it.
	 * @param {string} filePath
	 * @param {string} from
	 * @returns {string}
	 */
	resolveAndNormalize(filePath, from) {
		return this.normalizeExtension(this.resolvePath(filePath, from));
	}
}
//# sourceMappingURL=typescript-language-service.js.map