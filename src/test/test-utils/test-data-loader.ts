import * as fs from "fs";

export class TestDataLoader {
    static load(fileName: string): string {
        return fs.readFileSync(`${__dirname}/../../../src/test/test-data/${fileName}`, "utf-8");
    }
}
