// debug messages
import { OutputChannel, window,Uri } from "vscode";
import  * as packageJson from '../../package.json';
import  * as xqlint from '@quodatum/xqlint';

const _channel:OutputChannel = window.createOutputChannel("BaseX",{log:true});

export function logdate(){
    return (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
}
const replacerFunc = () => {
    const visited = new WeakSet();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_key :any, value :any) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
  };

export function dump(obj :object) {
  return JSON.stringify(obj,replacerFunc(),1)
}

export class channel {
    static log(msg: string) :void{
        _channel.appendLine(msg) 
    }
    static appendLine(msg: string) :void{
        _channel.appendLine(msg)
    }
    static dir(obj: object) :void{
        _channel.appendLine(dump(obj))
    }
    static show() :void{
        _channel.show(true)
    }
    static start(action:string,uri:Uri):void{
      _channel.appendLine(`${ action}: ${uri.fsPath}`) 
    }
}
channel.log(
  `Activate vscode-basex(${ packageJson.version }) *****************  XQLint(${ xqlint.version })`
);
channel.log(`todo`);
_channel.show(true);
