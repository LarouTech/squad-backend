/* eslint-disable prettier/prettier */
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NhlController } from './nhl.controller';
import { NhlService } from './nhl.service';
import { Player, PlayerSchema } from './players/player.schema';
import { PlayersDbService } from './players/players-db.service';

@Module({
  controllers: [NhlController],
  providers: [NhlService, PlayersDbService],
  imports: [HttpModule, MongooseModule.forFeature([{name: Player.name, schema: PlayerSchema}])]
})

export class NhlModule { }
