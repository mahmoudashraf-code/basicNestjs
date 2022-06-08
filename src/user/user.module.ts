import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthUserModule } from './auth/authuser.module';
import { CoursesModule } from './courses/courses.module';
import { ExplorerModule } from './explorer/explorer.module';
import { FileModule } from './file/file.module';
import { LanguageOfUserModule } from './languageOfUsers/languageOfUser.module';
import { ShortcutModule } from './shortcut/shortcut.module';
import { UsersOfUserModule } from './usersOfUser/usersofuser.module';
import { WebsiteModule } from './website/website.module';

@Module({
    imports: [
        ExplorerModule,
        FileModule,
        LanguageOfUserModule,
        WebsiteModule,
        CoursesModule,
        AuthUserModule,
        UsersOfUserModule,
        ShortcutModule,
        RouterModule.register([
            {
                path: "user",
                module: UserModule,
                children: [
                    {
                        path: "explorer",
                        module: ExplorerModule
                    },
                    {
                        path: "file",
                        module: FileModule
                    },
                    {
                        path: "auth",
                        module: AuthUserModule
                    },
                    {
                        path: "shortcut",
                        module: ShortcutModule
                    },
                    {
                        path: "users",
                        module: UsersOfUserModule
                    },
                    {
                        path: "website",
                        module: WebsiteModule
                    },
                    {
                        path: "courses",
                        module: CoursesModule
                    },
                    {
                        path: "language",
                        module: LanguageOfUserModule
                    }
                ],
            }
        ])
    ],
    controllers: [],
    providers: [],
})
export class UserModule { }
