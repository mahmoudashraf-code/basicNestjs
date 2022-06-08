import { LanguageController } from './language.controller';
import { Module } from '@nestjs/common';
import { AppService } from '../app.service';

@Module({
    imports: [],
    controllers: [LanguageController],
    providers: [AppService],
})
export class LanguageModule { }
