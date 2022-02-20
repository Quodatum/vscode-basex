// debug messages
import { OutputChannel, window } from "vscode";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XQLint = require("@quodatum/xqlint").XQLint;

const _channel:OutputChannel = window.createOutputChannel("BaseX log");
function logdate(){
    return (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
}

export class channel {
    static log(msg: string) :void{
        _channel.appendLine("["+logdate()+"] "+msg) 
    }
    static appendLine(msg: string) :void{
        _channel.appendLine(msg)
    }
    static show() :void{
        _channel.show
    }
}
channel.log("started, XQLint version: "+XQLint.version);
_channel.show