import { AuthGuard } from "@nestjs/passport";

export class UserLocalAuthGuard extends AuthGuard('user') { }