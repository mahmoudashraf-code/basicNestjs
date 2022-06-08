import { Module } from '@nestjs/common';
import { AppService } from '../../app.service';
import { FileController } from './file.controller';

@Module({
    imports: [],
    controllers: [FileController],
    providers: [AppService],
})
export class FileModule { }
