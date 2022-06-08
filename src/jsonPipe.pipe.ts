import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class jsonPipe implements PipeTransform {
    transform(value: string): string[] {
        if (value == "") return [];
        return value.split(",");
    }
}