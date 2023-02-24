// convert xqlint markers 
import { Diagnostic, DiagnosticSeverity, Position, Range } from "vscode";
import { Marker, XQLint } from "@quodatum/xqlint";
import { Configuration } from "../common";

// [XQST0059] module "http://www.rave-tech.com/bloomsbury/config" not found
// [XPST0008] "list-details#0": undeclared function
function isSuppressed(msg: string): boolean {
    const errs = Configuration.xquerySuppressErrors;
    return errs.some((x) => msg.includes(x));
}

export class XQueryLinter {

    lint(text: string): Diagnostic[] {
        const linter = new XQLint(text);
        const diagnostics = new Array<Diagnostic>();

        linter.getErrors().forEach((error: Marker) => {
            diagnostics.push(new Diagnostic(
                new Range(
                    new Position(error.pos.sl, error.pos.sc),
                    new Position(error.pos.el, error.pos.ec)
                ),
                error.message,
                isSuppressed(error.message) ? DiagnosticSeverity.Information : DiagnosticSeverity.Error
            ));
        });

        linter.getWarnings().forEach((warning: any) => {
            diagnostics.push(new Diagnostic(
                new Range(
                    new Position(warning.pos.sl, warning.pos.sc),
                    new Position(warning.pos.el, warning.pos.ec)
                ),
                warning.message,
                DiagnosticSeverity.Warning
            ));
        });
        return diagnostics;

    }
}
