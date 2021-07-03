/* eslint-disable prettier/prettier */
import { PlayerStat } from "./player-stat.model";
import { StatsType } from "./stats-type.model";

export class GameLogsStats {
    season: string;
    stat: PlayerStat;
    date: string;
    game: {
        content: {
            link: string
        },
        gamePk: number,
        link: string
    };
    isHome: boolean;
    isOT: boolean
    isWin: boolean
    opponent: {
        id: number,
        link: string,
        name: string
    };
    team: {
        id: number,
        name: string,
        link: string
    }
}

export class GameLogs {
    type: StatsType;
    splits: Array<GameLogsStats>
}