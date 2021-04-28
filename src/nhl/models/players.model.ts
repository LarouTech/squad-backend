/* eslint-disable prettier/prettier */
import { Team } from './team.model';

interface Person {
    fullName: string,
    id: number,
    link: string
}

interface Position {
    abbreviation: string,
    code: string,
    name: string,
    type: string
}
interface PlayerStatsictics {
    season: string,
    stat: {
        timeOnIce: string,
        assists: number,
        goals: number,
        pim: number,
        shots: number,
        games: number,
        hits: number,
        powerPlayGoals: number,
        powerPlayPoints: number,
        powerPlayTimeOnIce: string,
        evenTimeOnIce: string,
        penaltyMinutes: number,
        faceOffPct: number,
        shotPct: 4.17,
        gameWinningGoals: number,
        overTimeGoals: number,
        shortHandedGoals: number,
        shortHandedPoints: number,
        shortHandedTimeOnIce: string,
        blocked: number,
        plusMinus: number,
        points: number,
        shifts: number,
        timeOnIcePerGame: string,
        evenTimeOnIcePerGame: string,
        shortHandedTimeOnIcePerGame: string,
        powerPlayTimeOnIcePerGame: string
    }
}



interface PlayerStats {
    stats: {
        type?: {
            displayName?: string,
            gameType?: {
                id?: string,
                description?: string,
                postseason?: boolean
            }
        },
        stats: Array<PlayerStatsictics>
    }

}

interface logo {    
    id: number,
    background: string,
    endSeason: number,
    secureUrl: string,
    startSeason: number,
    teamId: number,
    url: string,
}

export interface LogoModel {
    logos: Array<logo>
}

export interface Players {
    id: string,
    jerseyNumber: string,
    person?: Person,
    position?: Position,
    team?: Team,
    stats: PlayerStats
    headshot: string,
    actionshot: string,
    logos?: LogoModel
}

