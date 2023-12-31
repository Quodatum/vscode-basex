/*
Execute command line async. result is promise<any> 
*/
import child_process = require("child_process");
import BufferList = require('bl');

const isWin: boolean = process.platform === "win32";

export class ChildProcess {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async spawn(executable: string, args: string[]): Promise<any> {
    const child = isWin
      ? child_process.spawn(process.env.comspec, ["/c", executable, ...args])
      : child_process.spawn(executable, args);

    const stdout = child.stdout ? new BufferList() : null;
    const stderr = child.stderr ? new BufferList() : null;

    if (child.stdout) {
      child.stdout.on('data', data => {
        stdout.append(data)
      })
    }

    if (child.stderr) {
      child.stderr.on('data', data => {
        stderr.append(data)
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<any>((resolve, reject) => {
      child.on('error', reject)

      child.on('close', code => {
        if (code === 0) {
          resolve(stdout)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const err: any = new Error(`child exited with code ${code}`)
          err.code = code
          err.stderr = stderr
          err.stdout = stdout
          reject(err)
        }
      })
    })
  }

}
