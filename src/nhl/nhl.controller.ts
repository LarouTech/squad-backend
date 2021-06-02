/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GetPlayerStatsDto } from './dto/get-player-stats.dto';
import { TeamsEnum } from './enums/teams.enum';
import { Players } from './models/players.model';

import { Team } from './models/team.model';
import { NhlService } from './nhl.service';
import { GameDetails } from './players/models/game-details.model';
import { Logo } from './players/models/logo.model';
import { Schedule } from './players/models/schedule.model';
import { Season } from './players/models/season.model';
import { Standings } from './players/models/standings.model';
import { Player } from './players/player.schema';
import { PlayersDbService } from './players/players-db.service';

@Controller('nhl')
export class NhlController {

    constructor(
        private nhlService: NhlService,
        private playersDbService: PlayersDbService) { }

    @Get('season/metadata')
    getSeasonMetaData(): Observable<Season> {
        return this.nhlService.getSeasonMetaData();
    }

    @Get('teams')
    getTeams(): Observable<Team[]> {
        return this.nhlService.getTeams();
    }

    @Get('teams/:id')
    getTeamById(@Param('id') id: string): Observable<Team> {
        return this.nhlService.getTeamById(id);
    }

    @Get('teams/:id/logos')
    getLogos(
        @Param('id') id: TeamsEnum,
        @Query('year') year?: number | string,
        @Query('type') type?: 'dark' | 'light' | 'alt'
    ): Observable<Logo[]> {
        return this.nhlService.getLogosByTeamId(id, year, type);
    }

    @Get('players/:id')
    getPlayerStats(
        @Param('id') id: string,
        @Query() getPlayerStatsDto: GetPlayerStatsDto): Observable<Players> {
        return this.nhlService.getPlayer(id, getPlayerStatsDto);
    }

    @Get('players')
    getAllPlayersStats(@Query() getPlayerStatsDto?: GetPlayerStatsDto): Observable<Players[]> {
        return this.nhlService.getAllPlayers(getPlayerStatsDto);
    }

    @Get('players/:id/gamelogs')
    getPlayerStatsGameLogs(
        @Param('id') id: string | number,
        @Query('teamId') teamId?: string | number): Observable<any> {
        return this.nhlService.getPlayerStatsGameLogs(id, teamId)
    }

    @Get('standings')
    getStandings(@Query('standingsType') standingType: 'byConference' | 'byDivision' | 'regularSeason'): Observable<Standings[]> {
        return this.nhlService.getStandings(standingType)
    }

    @Get('schedule')
    getAllSeasonGames(): Observable<Schedule[]> {
        return this.nhlService.getAllSeasonGames();
    }

    @Get('schedule/today')
    getTodayGames(): Observable<Schedule[]> {
        return this.nhlService.getTodayGames();
    }

    @Get('schedule/:id')
    getAllGamesByTeamId(@Param('id') id: number | string): Observable<Schedule[]> {
        return this.nhlService.getAllGamesByTeamId(id)
    }

    @Get('game/:id/details')
    getGameDeatilsByGameId(@Param('id') id: number | string): Observable<GameDetails> {
        return this.nhlService.getGameDeatilsByGameId(id)
    }


    @Get('fetch/players')
    fetchPlayers(): Promise<Player[]> {
        return this.playersDbService.getAllPlayersFromMongo();
    }

    @Get('save')
    save(): Promise<{message: string}> {
        return this.playersDbService.savePlayersToMongoController();
    }


    @Get('country/:code')
    getCountryByID(@Param('code') code: string): Observable<any> {
        return this.nhlService.getCountryByID(code)
    }






}