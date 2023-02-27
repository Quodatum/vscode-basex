import  * as ext from "@quodatum/xqlint"
import { Configuration } from ".";
import { channel } from "../common/logger";

export class factory{
    static XQLint( txt: string) :ext.XQLint{
    const platform= Configuration.xqueryPlatform;
    channel.log(platform);
    return new ext.XQLint(txt, {"platform": platform, "styleCheck": false })
  }
}
