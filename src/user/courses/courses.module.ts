import { CoursesController } from './courses.controller';

import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Module({
    imports: [],
    controllers: [CoursesController],
    providers: [AppService],
})
export class CoursesModule { }
