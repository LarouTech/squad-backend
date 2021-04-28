/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GetPlayerStatsDto } from './dto/get-player-stats.dto';
import { Players } from './models/players.model';
import { Roster } from './models/roster.model';
import { TeamRoster } from './models/team-roster.model';
import { Team } from './models/team.model';
import { NhlService } from './nhl.service';
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

    // @Get('teams/:id/roster')
    // getTeamRosterById(@Param('id') id: string): Observable<TeamRoster> {
    //     return this.nhlService.getTeamRosterById(id)
    // }

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

    @Get('teamId/all')
    getAllTeamId(): Observable<number[]> {
        return this.nhlService.getAllTeamId()
    }

    // @Get('rosters/all')
    // getAllRosters(): Observable<Roster[]> {
    //     return this.nhlService.getAllRosters();
    // }

    @Get('fetch/players')
    fetchPlayers() {
        return this.playersDbService.getAllPlayersFromMongo();
    }

    @Get('save')
    save() {
        return this.playersDbService.savePlayersToMongoController();
    }




}