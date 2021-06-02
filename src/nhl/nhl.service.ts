/* eslint-disable prettier/prettier */
import { HttpService, Injectable, NotFoundException, OnModuleInit, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { combineLatest, Observable, pipe } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Team } from './models/team.model';
import { Roster } from './models/roster.model';
import { GetPlayerStatsDto } from './dto/get-player-stats.dto';
import { Players } from './models/players.model';
import { TeamRoster } from './models/team-roster.model';
import { PlayerStatsEnum } from './enums/players-stats.enum'
import { People } from './players/models/people.model';
import { Logo } from './players/models/logo.model';
import { Schedule, ScheduleGames } from './players/models/schedule.model';
import { TeamsEnum } from './enums/teams.enum';
import { GameLogs } from './players/models/gamelog.model';
import { Standings } from './players/models/standings.model';
import { RedshiftData } from 'aws-sdk';
import { GameDetails } from './players/models/game-details.model';
import { Season } from './players/models/season.model';

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

    //GET SEASON META DATA 
    getSeasonMetaData(): Observable<Season> {
        return this.http.get<Season>(this.urlSetter('seasons/current'))
        .pipe(this.nhlStatsOperator('seasons'))
    }


    //GET GAME DATA BY GAMEID
    getGameDeatilsByGameId(gameId: number | string): Observable<GameDetails> {
        return this.http.get<GameDetails>(this.urlSetter(`game/${gameId}/feed/live`))
            .pipe(
                map((res: AxiosResponse) => {
                    delete res.data.copyright
                    const players: any[] = res.data.gameData.players;
                    const newPlayers = Object.values(players);

                    const awayLiveDataPlayers = res.data.liveData.boxscore.teams.away.players;
                    const homeLiveDataPlayers = res.data.liveData.boxscore.teams.home.players

                    const newAwayliveDataPlayers = Object.values(awayLiveDataPlayers)
                    const newHomeliveDataPlayers = Object.values(homeLiveDataPlayers)

                    res.data.liveData.boxscore.teams.away.players = newAwayliveDataPlayers;
                    res.data.liveData.boxscore.teams.home.players = newHomeliveDataPlayers
                    res.data.gameData.players = newPlayers

                    return res.data 
                 
                }),
                catchError((error) => {
                    throw new NotFoundException(error);
                }))
    }

    //GET NHL STANDINGS
    getStandings(standingType?: 'byConference' | 'byDivision' | 'regularSeason'): Observable<Standings[]> {
        const params = {
            standingsType: !standingType ? 'regularSeason' : standingType,
            season: this.configService.get('nhl.currentSeason'),
            expand: 'standings.record'
        }

        return this.http.get<Standings[]>(this.urlSetter('standings'), { params: params })
            .pipe(this.nhlStatsOperator('records'))
    }

    //GET COUNTRY DATA BY COUNTRY CODE
    getCountryByID(code: string) {
        const api = 'https://restcountries.eu/rest/v2/alpha'
        return this.http.get(`${api}/${code}`)
            .pipe(
                map((res: AxiosResponse) => {
                    return res.data
                })
            )
    }

    //GET PLAYER STATS BY ID FOR EACH GAME PLAYED IN A SPECIFIC SEASON
    getPlayerStatsGameLogs(id: string | number, opponentId?: string | number): Observable<any> {
        const params = {
            stats: 'gameLog',
            season: +this.configService.get<GameLogs>('nhl.currentSeason')
        }

        return this.http.get(this.urlSetter(`people/${id}/stats/`), { params: params })
            .pipe(
                this.nhlStatsOperator('stats'),
                map((stats: GameLogs) => {
                    return stats[0]
                }),
                map((stats: GameLogs) => {
                    if (opponentId) {
                        return stats.splits.filter(spl => spl.opponent.id === +opponentId)
                    } else {
                        return stats
                    }
                })
            )
    }

    //GET LOGOS BY TEAM ID
    getLogosByTeamId(id: TeamsEnum, year?: number | string, type?: 'dark' | 'light' | 'alt', gameId?: number): Observable<Logo[]> {
        if (!(id in TeamsEnum)) {
            throw new NotFoundException('please enter a valid team Id')
        }

        const api = `https://records.nhl.com/site/api/franchise?include=teams.logos&cayenneExp=mostRecentTeamId=${id.toString()}`

        return this.http.get<Logo[]>(api)
            .pipe(
                this.nhlStatsOperator('data'),
                map(data => {
                    return data[0].teams[0].logos
                }),
                map((logos: Logo[]) => {
                    if (year) {

                        return logos.filter(l => {
                            return type ? l.endSeason === +year && l.background === type : l.endSeason === +year
                        })
                    } else {
                        return !gameId ? logos : { ...logos, gameId }
                    }
                })
            )
    }

    //GET ALL NHL TEAMS n
    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.urlSetter('teams'))
            .pipe(
                this.nhlStatsOperator('teams'),
                mergeMap((teams: Team[]) => {

                    return this.http.get(this.logosApi)
                        .pipe(
                            this.nhlStatsOperator('data'),
                            map((logos: any[]) => {

                                //exclude seatle kraken
                                teams = teams.filter(t => t.id != 55)

                                return teams = teams.map(team => {

                                    const logosArr: any[] = logos.filter(t => t.mostRecentTeamId === team.id)[0].teams[0].logos
                                        .filter(logo => logo.endSeason === +this.configService.get('nhl.currentSeason'))

                                    const light = logosArr.filter(l => l.background === 'light')[0];
                                    const dark = logosArr.filter(l => l.background === 'dark')[0];
                                    const alt = logosArr.filter(l => l.background === 'alt')[0];

                                    return {
                                        ...team,
                                        logos: {
                                            dark: dark,
                                            light: light,
                                            alt: alt
                                        }
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

                                const teamLogos: Logo[] = logos.filter(t => t.mostRecentTeamId === team.id)[0].teams[0].logos
                                    .filter(logo => logo.endSeason === +this.configService.get('nhl.currentSeason'))

                                const dark = teamLogos.filter(l => l.background === 'dark')[0];
                                const light = teamLogos.filter(l => l.background === 'light')[0];
                                const alt = teamLogos.filter(l => l.background === 'alt')[0];

                                return {
                                    ...team,
                                    logos: {
                                        dark: dark,
                                        light: light,
                                        alt: alt
                                    }
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
        let config: AxiosRequestConfig
        if (dto) {
            config = {
                params: {
                    stats: dto.stats,
                    // season: this.configService.get('auth.currentSeason')
                }
            }
        } else {
            config = {
                params: {
                    stats: PlayerStatsEnum.singleSeason,
                    season: this.configService.get('nhl.currentSeason')
                }
            }
        }



        const urlTail1 = `people/${id}`;
        const urlTail2 = `people/${id}/stats`;

        return this.http.get<People>(this.urlSetter(urlTail1))
            .pipe(
                this.nhlStatsOperator('people'),
                mergeMap((people: People) => {

                    return this.http.get<Players>(this.urlSetter(urlTail2), config)
                        .pipe(
                            this.nhlStatsOperator('stats'),
                            map(player => {

                                return {
                                    stats: {
                                        type: player['0'].type,
                                        stats: !dto ? player['0'].splits[0] : player['0'].splits
                                    },
                                    id: id,
                                    ...roster,
                                    headshot: `${this.imageApi}/headshots/current/168x168/${id}.jpg`,
                                    actionshot: `${this.imageApi}/actionshots/${id}.jpg`,
                                    people: people[0]
                                }
                            })
                        )
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

    //GET ARRAY OF ACTIVE TEAM ID
    getAllTeamId(): Observable<number[]> {
        return this.getTeams()
            .pipe(map((teams: Team[]) => {
                return teams.map(t => t.id);
            }))
    }

    //GET ALL SEASONS GAMES
    getAllSeasonGames() {

        const params = {
            expand: 'schedule.linescore',
            season: this.configService.get('nhl.currentSeason')
        }

        return this.http.get(this.urlSetter('schedule'), { params: params })
            .pipe(
                this.nhlStatsOperator('dates')
            )
    }

    //GET TODAYS GAMES
    getTodayGames(): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(this.urlSetter('schedule'))
            .pipe(this.nhlStatsOperator('dates'))
    }

    //GET ALL SEASON + PLAYOFF GAMES BY TEAM ID
    getAllGamesByTeamId(id: number | string): Observable<Schedule[]> {
        const params = {
            season: this.configService.get<Schedule[]>('nhl.currentSeason'),
            teamId: id
        }
        return this.http.get(this.urlSetter('schedule'), { params: params })
            .pipe(
                this.nhlStatsOperator('dates'),
                map((schedule: Schedule[]) => {

                    return schedule.map(s => {
                        return {
                            ...s,
                            games: s.games[0]
                        }
                    })


                })
            )

    }

    //GET ALL ACTIVE ROSTERS
    private getAllRosters(): Observable<Roster[]> {
        return this.getTeams()
            .pipe(
                switchMap((teams: Team[]) => {
                    const rosterPerTeam: Observable<TeamRoster>[] = []

                    //FILTER OUT SEATLE KRAKENS
                    teams = teams.filter(t => t.id != 55)

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
    private getTeamRosterById(id: string, team?: Team): Observable<TeamRoster> {
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

    //ADD URL STRING TO statsApi VARIABLE
    private urlSetter(urlTail: string): string {
        return `${this.statsApi}/${urlTail}`;
    }

}
