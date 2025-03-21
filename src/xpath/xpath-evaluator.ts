import * as xpath from "xpath";

import { sync } from 'slimdom-sax-parser';
import * as slimdom from "slimdom";
export class EvaluatorResult {
    type: EvaluatorResultType;
    result: Node[] | number | string | boolean;
}

export class EvaluatorResultType {
    static SCALAR_TYPE = 0;
    static NODE_COLLECTION = 1;
}

export class XPathResultTypes {
    static ANY_TYPE = 0;
    static NUMBER_TYPE = 1;
    static STRING_TYPE = 2;
    static BOOLEAN_TYPE = 3;
    static UNORDERED_NODE_ITERATOR_TYPE = 4;
    static ORDERED_NODE_ITERATOR_TYPE = 5;
    static UNORDERED_NODE_SNAPSHOT_TYPE = 6;
    static ORDERED_NODE_SNAPSHOT_TYPE = 7;
    static ANY_UNORDERED_NODE_TYPE = 8;
    static FIRST_ORDERED_NODE_TYPE = 9;
}

export class XPathEvaluator {
    static evaluate(query: string, xml: string, _ignoreDefaultNamespace: boolean): string {
        /* if (ignoreDefaultNamespace) {
            xml = xml.replace(/xmlns=".+"/g, (match: string) => {
                return match.replace(/xmlns/g, "xmlns:default");
            });
        } */

        return "@TODO"
    }
       
}
