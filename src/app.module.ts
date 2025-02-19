import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TodoModule } from "./todo/todo.module";
import { ListModule } from './list/list.module';

@Module({
  imports: [AuthModule, UserModule, TodoModule, ListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
