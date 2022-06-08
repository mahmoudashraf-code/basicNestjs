import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AppService } from '../app.service';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule
  ],
  providers: [AuthService, LocalStrategy, AppService],
  exports: []
})
export class AuthModule { }
