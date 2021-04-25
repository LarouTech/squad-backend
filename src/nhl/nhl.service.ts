/* eslint-disable prettier/prettier */
import { HttpService, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { combineLatest, Observable, pipe } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Team } from './models/team.model';
import { Roster } from './models/roster.model';
import { GetPlayerStatsDto } from './dto/get-player-stats.dto';
import { Players } from './models/players.model';
import { TeamRoster } from './models/team-roster.model';
import { PlayerStatsEnum } from './enums/players-stats.enum'

@Injectable()
export class NhlService implements OnModuleInit {
    private statsApi: string;
    private imageApi: string;
    private logosApi: string

    private nhlStatsOperator = (key: string) => pipe(
        map((res: AxiosResponse) => {
            return res.data[key]
        }),
        catchError((error) => {
            throw new NotFoundException(error);
        }),
    )

    constructor(
        private http: HttpService,
        private configService: ConfigService) { }

    onModuleInit() {
        this.statsApi = this.configService.get('nhl.statsApi')
        this.imageApi = this.configService.get('nhl.imagesApi')
        this.logosApi = this.configService.get('nhl.logosApi')
    }

    //GET ALL NHL TEAMS
    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.urlSetter('teams'))
            .pipe(
                this.nhlStatsOperator('teams'),
                mergeMap((teams: Team[]) => {

                    return this.http.get(this.logosApi)
                        .pipe(
                            this.nhlStatsOperator('data'),
                            map((logos: any[]) => {

                                return teams = teams.map(team => {

                                    return {
                                        ...team,
                                        logos: logos.filter(t => t.mostRecentTeamId === team.id)[0].teams[0].logos
                                            .filter(logo => logo.endSeason === +this.configService.get('nhl.currentSeason'))
                                    }
                                })
                            })
                        )
                })
            )
    }

    //GET NHL TEAM BY ID
    getTeamById(id: string | number): Observable<Team> {
        return this.http.get<Team>(this.urlSetter(`teams/${id}`))
            .pipe(
                this.nhlStatsOperator('teams'),
                mergeMap((team: Team) => {
                    team = team[0]

                    return this.http.get(this.logosApi)
                        .pipe(
                            this.nhlStatsOperator('data'),
                            map((logos: any[]) => {

                                const isExist: boolean = logos.find(t => t.mostRecentTeamId === team.id);
                                if (!isExist) {
                                    return team
                                }

                                return {
                                    ...team,
                                    logos: logos.filter(t => t.mostRecentTeamId === team.id)[0].teams[0].logos
                                        .filter(logo => logo.endSeason === +this.configService.get('nhl.currentSeason'))
                                }
                            }),
                            mergeMap((team: Team) => {

                                return this.http.get(`${this.statsApi}/teams/${id}/stats`)
                                    .pipe(
                                        this.nhlStatsOperator('stats'),
                                        map(data => {

                                            if (!data[0].splits[0] && !data[1].splits[0]) {
                                                throw new NotFoundException('invalid or inactive team id');
                                            }

                                            const ranking = data[1].splits[0].stat
                                            const stats = data[0].splits[0].stat

                                            return {
                                                ...team,
                                                stats: {
                                                    ranking,
                                                    stats
                                                }
                                            }

                                        })
                                    )
                            })
                        )
                })
            )
    }


    //GET PLAYER STATS BY PLAYER ID
    getPlayer(id: string, dto?: GetPlayerStatsDto, roster?: Roster): Observable<Players> {
        const config: AxiosRequestConfig = {
            params: {
                stats: PlayerStatsEnum.singleSeason,
                season: this.configService.get('auth.currentSeason')
            }
        }

        const urlTail = `people/${id}/stats`;
        return this.http.get<Players>(this.urlSetter(urlTail), config)
            .pipe(
                this.nhlStatsOperator('stats'),
                map(player => {

                    return {
                        stats: {
                            type: player['0'].type,
                            stats: player['0'].splits[0]
                        },
                        id: id,
                        ...roster,
                        headshot: `${this.imageApi}/headshots/current/168x168/${id}.jpg`,
                        actionshot: `${this.imageApi}/actionshots/${id}.jpg`
                    }
                })
            )
    }

    //GET ALL ACTIVE PLAYERS STATS
    getAllPlayers(dto?: GetPlayerStatsDto): Observable<Players[]> {
        return this.getAllRosters()
            .pipe(
                mergeMap((rosters: Roster[]) => {
                    const playersStats: Observable<Players>[] = [];

                    rosters.forEach(roster => {
                        playersStats.push(this.getPlayer(roster.person.id.toString(), dto, roster))
                    })

                    return combineLatest([...playersStats])
                }),
            )
    }

    //GET ALL ACTIVE ROSTERS
    getAllRosters(): Observable<Roster[]> {
        return this.getTeams()
            .pipe(
                switchMap((teams: Team[]) => {
                    const rosterPerTeam: Observable<TeamRoster>[] = []

                    teams.forEach(team => {
                        rosterPerTeam.push(this.getTeamRosterById(team.id.toString(), team))
                    })

                    return combineLatest([...rosterPerTeam])
                        .pipe(map(
                            (obj: any[]) => {
                                const allRosters = [];

                                obj.forEach(element => {
                                    const team = element.team
                                    let roster = []
                                    roster = element.roster;

                                    roster.forEach(roster => {
                                        roster['team'] = team;
                                        allRosters.push(roster)
                                    })
                                })

                                return allRosters
                            }
                        ))
                }),
                catchError(error => {
                    throw new NotFoundException(error);
                })

            )
    }

    //GET ROSTER PER TEAM ID
    getTeamRosterById(id: string, team?: Team): Observable<TeamRoster> {
        const urlTail = `teams/${id}/roster`
        return this.http.get<Roster>(this.urlSetter(urlTail))
            .pipe(
                this.nhlStatsOperator('roster'),
                map((roster: Roster[]) => {
                    const r = {
                        team: team,
                        roster: roster
                    }
                    return r
                })
            )
    }

    //GET ARRAY OF ACTIVE TEAM ID
    getAllTeamId(): Observable<number[]> {
        return this.getTeams()
            .pipe(map((teams: Team[]) => {
                return teams.map(t => t.id);
            }))
    }

    //ADD URL STRING TO statsApi VARIABLE
    private urlSetter(urlTail: string): string {
        return `${this.statsApi}/${urlTail}`;
    }

}
