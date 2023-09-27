import { LintRange } from "@quodatum/xqlint"; 
import { Range } from "vscode";

export function importRange(lintRange?: LintRange): Range {
    return lintRange?
                    new Range(lintRange.sl, lintRange.sc, lintRange.el, lintRange.ec)
                    :new Range(0,0,0,0);
  }