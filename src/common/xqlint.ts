import * as ext from "@quodatum/xqlint";
import { TextDocument, Position, Range } from "vscode";

import { Configuration } from ".";
import { channel } from "../common/logger";

// map of seen documents
const xlints: MapType = {};
type MapType = {
  [id: string]: ext.XQLint;
}

export class Factory {

  // return xqlint for document
  static XQLint(document: TextDocument, refresh = true): ext.XQLint {
    const key = document.uri.toString();
    const xqlint = xlints[key];
    const isNew = typeof xqlint === "undefined";
    channel.log("XQLint for: " + key + ", isnew: " + isNew + ", refresh: " + refresh);
    if (isNew || refresh) {
      const processor = Configuration.xqueryProcessor;
      const xqlint = new ext.XQLint(document.getText(), { "processor": processor, "styleCheck": false });
      xlints[key] = xqlint;
      return xqlint;
    } else {
      return xqlint;
    }
  }
}
export function importRange(lintRange: ext.LintRange): Range {
  const spos = new Position(lintRange.sl, lintRange.sc);
  const epos = new Position(lintRange.el, lintRange.ec);
  return new Range(spos, epos)
}