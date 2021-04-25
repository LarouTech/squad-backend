/* eslint-disable prettier/prettier */
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { LeagueController } from './league.controller';
import { League, LeagueSchema } from './league.schema';
import { LeagueService } from './league.service';

@Module({
  controllers: [LeagueController],
  providers: [LeagueService, AuthService],
  imports: [HttpModule, MongooseModule.forFeature([{name: League.name, schema: LeagueSchema}])]
})
export class LeagueModule {}
