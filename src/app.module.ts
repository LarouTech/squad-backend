/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import configuration from './configuration';
import { LeagueModule } from './league/league.module';
import { NhlModule } from './nhl/nhl.module';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', load: [configuration] }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.6dsrh.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`, { useNewUrlParser: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    NhlModule,
    LeagueModule,
    ProfileModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
