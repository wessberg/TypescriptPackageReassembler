import {ITypescriptPackageReassemblerOptions} from "./i-typescript-package-reassembler-options";
import {ITypescriptPackageReassembleResult} from "./i-typescript-package-reassemble-result";

export interface ITypescriptPackageReassembler {
	reassemble ({declarationStatements, compiledStatements}: ITypescriptPackageReassemblerOptions): ITypescriptPackageReassembleResult;
}