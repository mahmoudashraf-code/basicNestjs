import { LanguageOfUserController } from './languageOfUser.controller';
import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Module({
    imports: [],
    controllers: [LanguageOfUserController],
    providers: [AppService],
})
export class LanguageOfUserModule { }
