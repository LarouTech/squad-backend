/* eslint-disable prettier/prettier */
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile, ProfileSchema } from './profile.schema';
import { ProfileGateway } from './profile.gateway';


@Module({
  controllers: [ProfileController],
  providers: [ProfileGateway, AuthService, ProfileService],
  imports: [HttpModule, MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }])],
  exports: [ProfileService]
})
export class ProfileModule { }
