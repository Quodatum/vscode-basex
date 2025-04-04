import { workspace, Uri } from "vscode";
import {scope} from "."
export const ExtensionTopLevelSection = "basexTools";


export class Configuration {
    static get enableXmlTreeView(): boolean {
        return this._getForWindow<boolean>("xmlTree.enableTreeView");
    }

    static get enableXmlTreeViewMetadata(): boolean {
        return this._getForWindow<boolean>("xmlTree.enableViewMetadata");
    }

    static get enableXmlTreeViewCursorSync(): boolean {
        return this._getForWindow<boolean>("xmlTree.enableViewCursorSync");
    }

    static get ignoreDefaultNamespace(): boolean {
        return this._getForWindow<boolean>("xpath.ignoreDefaultNamespace");
    }

    static get persistXPathQuery(): boolean {
        return this._getForWindow<boolean>("xpath.persistXPathQuery");
    }

    static get xmlFormatterImplementation(): string {
        return this._getForWindow<string>("xml.FormatterImplementation");
    }
    // arrayof command lines for Xquery execution
 /*    static get xqueryExecutionCommands():executionCommand[] {
        return this._getForWindow<executionCommand[] >("xquery.executionCommands");
    } */

    static get xquerySuppressErrors(): string[] {
        return this._getForWindow<string[]>("xquery.suppressErrors");
    }
    // name of lastused xquery execution command
    static get xqueryExecutionDefault(): string {
        return this._getForWindow<string>("xquery.executionDefault");
    }
    static set xqueryExecutionDefault(value: string) {
        this._setForWindow("xquery.executionDefault",value);
    }
   
    static get xqueryProfile(): string {
      return this._getForWindow<string>("xquery.profile");
    }
    static set xqueryProfile(value: string) {
       this._setForWindow("xquery.profile",value);
      }
    static get xqueryShowHovers(): boolean {
        return this._getForWindow<boolean>("xquery.showHovers");
    }
    static set xqueryShowHovers(value: boolean) {
        this._setForWindow("xquery.showHovers",value);
    }

    static enforcePrettySelfClosingTagOnFormat(resource: Uri): boolean {
        return this._getForResource<boolean>("xml.enforcePrettySelfClosingTagOnFormat", resource);
    }

    static removeCommentsOnMinify(resource: Uri): boolean {
        return this._getForResource<boolean>("xml.removeCommentsOnMinify", resource);
    }

    static splitAttributesOnFormat(resource: Uri): boolean {
        return this._getForResource<boolean>("xml.splitAttributesOnFormat", resource);
    }

    static splitXmlnsOnFormat(resource: Uri): boolean {
        return this._getForResource<boolean>("xml.splitXmlnsOnFormat", resource);
    }

    private static _getForResource<T>(section: string, resource: Uri): T {
        return workspace.getConfiguration(ExtensionTopLevelSection, resource).get<T>(section);
    }

    private static _getForWindow<T>(section: string): T  {
        return workspace.getConfiguration(ExtensionTopLevelSection,scope()).get<T>(section);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static _setForWindow(section: string,value:any)  {
         workspace.getConfiguration(ExtensionTopLevelSection,scope()).update(section,value);
    }
    // arrayof command lines for Xquery execution
 static xqueryObject<T>(cmd:string):T[] {
    return this._getForWindow<T[]>(cmd);
}
}
