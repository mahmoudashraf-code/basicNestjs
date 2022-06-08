import { Module } from '@nestjs/common';
import { AppService } from '../../app.service';
import { ExplorerController } from './explorer.controller';

@Module({
  controllers: [ExplorerController],
  providers: [AppService],
  imports: []
})
export class ExplorerModule { }
