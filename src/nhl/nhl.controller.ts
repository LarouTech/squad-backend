/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GetPlayerStatsDto } from './dto/get-player-stats.dto';
import { TeamsEnum } from './enums/teams.enum';
import { Players } from './models/players.model';

import { Team } from './models/team.model';
import { NhlService } from './nhl.service';
import { GameLogs } from './players/models/gamelog.model';
import { Logo } from './players/models/logo.model';
import { Schedule } from './players/models/schedule.model';
import { Standings } from './players/models/standings.model';
import { PlayersDbService } from './players/players-db.service';

@Controller('nhl')
export class NhlController {

    constructor(
        private nhlService: NhlService,
        private playersDbService: PlayersDbService) { }

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
        @Query('teamId') teamId?: string | number) {
        return this.nhlService.getPlayerStatsGameLogs(id, teamId)
    }

    // @Get('teamId/all')
    // getAllTeamId(): Observable<number[]> {
    //     return this.nhlService.getAllTeamId()
    // }

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

    @Get('fetch/players')
    fetchPlayers() {
        return this.playersDbService.getAllPlayersFromMongo();
    }

    @Get('save')
    save() {
        return this.playersDbService.savePlayersToMongoController();
    }

    @Get('country/:code')
    getCountryByID(@Param('code') code: string) {
        return this.nhlService.getCountryByID(code)
    }






}