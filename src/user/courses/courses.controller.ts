import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { join } from 'path';
import { iWebsiteBlocks } from '../website/website.interface';
import { Response } from 'express';
import { AppService } from 'src/app.service';
import { SessionGuard } from 'src/session.guard';
import { GetUser } from 'src/getUser.decorator';
import { iUser } from 'src/users/users.interface';
import { iCoursesEnrollFile, iUserEnrollCourcesData } from './iCoursesEnroll.interface';
import { RolesGuard } from 'src/users/role/roles.guard';
import { Roles } from 'src/users/role/roles.decorator';
import { Role } from 'src/users/role/role.enum';

@Controller()
export class CoursesController {
    constructor(private readonly app: AppService) { }

    @Get("details/:id/:courseId")
    getCourseDetails(@Res() res: Response, @Param("id") id: string, @Query("path") path: string, @Param("courseId") courseId: string) {
        let courses: iWebsiteBlocks = this.app.file(join("users", id, "website.json")).get().data;
        res.json({
            file: this.app.file(join("users", id, "explorer", path)).get(),
            data: courses[courseId]
        });
    }

    @UseGuards(SessionGuard)
    @Post("enroll/:courseId")
    enrollToCourse(@Res() res: Response, @GetUser() user: iUser, @Param("courseId") courseId: string) {
        let enrollCourses: iCoursesEnrollFile = this.app.file(join("users", user.hostId, "coursesEnroll.json")).get();
        if (enrollCourses[user.id] == undefined) enrollCourses[user.id] = {}
        enrollCourses[user.id][courseId] = {
            id: courseId,
            pass: -1,
            stopAt: -1,
            total: -1
        }
        this.app.file(join("users", user.hostId, "coursesEnroll.json")).write(enrollCourses);
        res.json(true);
    }

    @UseGuards(SessionGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    @Post("enroll/:userId/:courseId")
    enrollToCourseById(@Res() res: Response, @GetUser() user: iUser, @Param("courseId") courseId: string, @Param("userId") userId: string) {
        let enrollCourses: iCoursesEnrollFile = this.app.file(join("users", user.id, "coursesEnroll.json")).get();
        if (enrollCourses[userId] == undefined) enrollCourses[userId] = {}
        enrollCourses[userId][courseId] = {
            id: courseId,
            pass: -1,
            stopAt: -1,
            total: -1
        }
        this.app.file(join("users", user.id, "coursesEnroll.json")).write(enrollCourses);
        res.json(true);
    }

    @UseGuards(SessionGuard)
    @Delete("enroll/:courseId")
    deleteEnrollToCourse(@Res() res: Response, @GetUser() user: iUser, @Param("courseId") courseId: string) {
        let enrollCourses: iCoursesEnrollFile = this.app.file(join("users", user.hostId, "coursesEnroll.json")).get();
        delete enrollCourses[user.id][courseId];
        this.app.file(join("users", user.hostId, "coursesEnroll.json")).write(enrollCourses);
        res.json(true);
    }

    @UseGuards(SessionGuard)
    @Get("getUserCourses")
    getUsersCourses(@Res() res: Response, @GetUser() user: iUser) {
        res.json(this.app.file(join("users", user.hostId, "coursesEnroll.json")).get()[user.id]);
    }

    @UseGuards(SessionGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    @Get("getUserCourses/:id")
    getUsersCoursesById(@Res() res: Response, @GetUser() user: iUser, @Param("id") id: string) {
        res.json(this.app.file(join("users", user.id, "coursesEnroll.json")).get()[id]);
    }

    @UseGuards(SessionGuard)
    @Get("getUserCourse/:courseId")
    getUsersCourse(@Res() res: Response, @GetUser() user: iUser, @Param("courseId") courseId: string) {
        res.json(this.app.file(join("users", user.hostId, "coursesEnroll.json")).get()[user.id][courseId]);
    }

    @UseGuards(SessionGuard)
    @Post("getUserCourse/:id")
    saveUsersCourse(@Res() res: Response, @GetUser() user: iUser, @Param("id") courseId: string, @Body("data") data: iUserEnrollCourcesData) {
        let enrollCourses: iCoursesEnrollFile = this.app.file(join("users", user.hostId, "coursesEnroll.json")).get();
        enrollCourses[user.id][courseId] = {
            id: courseId,
            ...data
        }
        this.app.file(join("users", user.hostId, "coursesEnroll.json")).write(enrollCourses);
        res.json(true);
    }
}