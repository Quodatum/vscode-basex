// convert xqlint markers 
import { Diagnostic, DiagnosticSeverity, TextDocument }  from "vscode";
import { Marker } from "@quodatum/xqlint";
import { Configuration } from "../common";
import  {XQLintFactory,importRange} from "../common/xqlint";

export class XQueryLinter {

    lint(document: TextDocument): Diagnostic[] {
        const linter = XQLintFactory.XQLint(document,true); //refresh because changed
        const diagnostics = new Array<Diagnostic>();

        linter.getErrors().forEach((error: Marker) => {
            diagnostics.push(new Diagnostic(
                importRange( error.pos ),
                error.message,
                isSuppressed(error.message) ? DiagnosticSeverity.Information : DiagnosticSeverity.Error
            ));
        });

        linter.getWarnings().forEach((warning: Marker) => {
            diagnostics.push(new Diagnostic(
                importRange(warning.pos ),
                warning.message,
                DiagnosticSeverity.Warning
            ));
        });
        return diagnostics;

    }
}
// [XQST0059] module "http://www.rave-tech.com/bloomsbury/config" not found
// [XPST0008] "list-details#0": undeclared function
function isSuppressed(msg: string): boolean {
    const errs = Configuration.xquerySuppressErrors;
    return errs.some((x) => msg.includes(x));
}

