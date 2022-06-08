import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [
    AuthModule,
    LanguageModule,
    UserModule,
    UsersModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(process.cwd(), 'views'),
    //   exclude: ['/api*'],
    //   serveStaticOptions: {
    //     redirect: false
    //   }
    // }),
    RouterModule.register([
      {
        path: "users",
        module: UsersModule
      },
      {
        path: "auth",
        module: AuthModule
      },
      {
        path: "language",
        module: LanguageModule
      }
    ])
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {

}

