import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from "express";
import { iUser } from './users/users.interface';

export const GetUser = createParamDecorator((data: Request, ctx: ExecutionContext): iUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});