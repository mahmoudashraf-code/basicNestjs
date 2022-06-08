import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync, writeFileSync } from "fs"

@Injectable()
export class AppService {
    path: string = join(process.cwd(), "database");
    file(file: string) {
        return {
            get: () => {
                return JSON.parse(readFileSync(join(this.path, file)).toString());
            },
            write: (data: any) => {
                return writeFileSync(join(this.path, file), JSON.stringify(data));
            },
        }
    }
    getRndString() {
        return `_${Math.floor(Math.random() * 10000000000)}`;
    }
}
