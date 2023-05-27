import { workspace, Uri } from "vscode";

const ExtensionTopLevelSection = "basexTools";

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

    static get xqueryExecutionArguments(): string[] {
        return this._getForWindow<string[]>("xquery.executionArguments");
    }

    static get xquerySuppressErrors(): string[] {
        return this._getForWindow<string[]>("xquery.suppressErrors");
    }
    
    static get xqueryExecutionEngine(): string {
        return this._getForWindow<string>("xquery.executionEngine");
    }

    static get xqueryProcessor(): string {
      // @todo  return this._getForWindow<string>("xquery.processor");
      return "basex"
    }
    static xqueryShowHovers(resource: Uri): boolean {
        return this._getForResource<boolean>("xquery.showHovers", resource);
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
        return workspace.getConfiguration(ExtensionTopLevelSection).get<T>(section);
    }
}
