import { Module } from '@nestjs/common';
import { AppService } from '../../app.service';
import { ShortcutController } from './shortcut.controller';

@Module({
    imports: [],
    controllers: [ShortcutController],
    providers: [AppService],
})
export class ShortcutModule { }
