import { Module } from '@nestjs/common';
import { AppService } from '../../app.service';
import { WebsiteController } from './website.controller';

@Module({
    imports: [],
    controllers: [WebsiteController],
    providers: [AppService],
})
export class WebsiteModule { }
