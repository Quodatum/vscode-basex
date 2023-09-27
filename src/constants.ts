/* eslint-disable @typescript-eslint/no-namespace */
export namespace commands {
    export const xqExecute = "basexTools.executeXQuery";
    export const xqDoc = "basexTools.xqDoc";  // used as url scheme
    export const xqParse = "basexTools.xqParse"; // used as url scheme
    export const xqProcessor = "basexTools.processor"; 
    export const xqSelectDeclaration = "basexTools.selectDeclaration";
    export const xqLibrary = "basexTools.xqLibrary";           
    export const xqLintReport = "basexTools.xqLintReport";
    export const xqClearDiagnostics ="basexTools.clearDiagnostics"

    export const getCurrentXPath = "basexTools.getCurrentXPath";        
    export const evaluateXPath = "basexTools.evaluateXPath";
     
    export const formatAsXml = "basexTools.formatAsXml";
    export const xmlToText = "basexTools.xmlToText";
    export const textToXml = "basexTools.textToXml";

    export const minifyXml = "basexTools.minifyXml";
}

export namespace contextKeys {
    export const xmlTreeViewEnabled = "xmlTreeViewEnabled";
}

export namespace diagnosticCollections {
    export const xquery = "XQueryDiagnostics";
    export const xqActions = "XQueryActions";
}

export namespace languageIds {
    export const xml = "xml";
    export const xsd = "xsd";
    export const xquery = "xquery";
}

export namespace nativeCommands {
    export const revealLine = "revealLine";
}

export namespace stateKeys {
    export const xpathQueryHistory = "xpathQueryHistory";
    export const xPathQueryLast = "xPathQueryLast";
}

export namespace uriSchemes {
    export const file = "file";
    export const untitled = "untitled";
}

export namespace views {
    export const xmlTreeView = "xmlTreeView";
}

export namespace xmlFormatterImplementations {
    export const classic = "classic";
    export const v2 = "v2";
}
