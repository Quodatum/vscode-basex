import  * as ext from "@quodatum/xqlint"
import { Configuration } from ".";
import { channel } from "../common/logger";

export class factory{
    static XQLint( txt: string) :ext.XQLint{
    const processor= Configuration.xqueryProcessor;
    channel.log(processor);
    return new ext.XQLint(txt, {"processor": processor, "styleCheck": false })
  }
}
