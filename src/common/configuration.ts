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
        return this._getForWindow<string>("xmlFormatterImplementation");
    }

    static get xqueryExecutionArguments(): string[] {
        return this._getForWindow<string[]>("xquery.executionArguments");
    }

    static get xqueryExecutionEngine(): string {
        return this._getForWindow<string>("xquery.executionEngine");
    }

    static get xqueryExecutionInputLimit(): number {
        return this._getForWindow<number>("xquery.executionInputLimit");
    }

    static get xqueryExecutionInputSearchPattern(): string {
        return this._getForWindow<string>("xquery.executionInputSearchPattern");
    }

    static enforcePrettySelfClosingTagOnFormat(resource: Uri): boolean {
        return this._getForResource<boolean>("enforcePrettySelfClosingTagOnFormat", resource);
    }

    static removeCommentsOnMinify(resource: Uri): boolean {
        return this._getForResource<boolean>("removeCommentsOnMinify", resource);
    }

    static splitAttributesOnFormat(resource: Uri): boolean {
        return this._getForResource<boolean>("splitAttributesOnFormat", resource);
    }

    static splitXmlnsOnFormat(resource: Uri): boolean {
        return this._getForResource<boolean>("splitXmlnsOnFormat", resource);
    }

    private static _getForResource<T>(section: string, resource: Uri): T {
        return workspace.getConfiguration(ExtensionTopLevelSection, resource).get<T>(section);
    }

    private static _getForWindow<T>(section: string): T  {
        return workspace.getConfiguration(ExtensionTopLevelSection).get<T>(section);
    }
}
