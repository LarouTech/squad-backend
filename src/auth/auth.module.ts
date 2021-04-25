/* eslint-disable prettier/prettier */
import { HttpModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorizerGuard } from './authorizer.guard';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, AuthorizerGuard],
  exports: [AuthService, AuthorizerGuard]
})
export class AuthModule {}
