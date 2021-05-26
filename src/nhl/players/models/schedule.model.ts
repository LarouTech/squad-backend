/* eslint-disable prettier/prettier */
export class ScheduleGames {
  content: {
    link: string;
  };
  gameDate: Date;
  gamePk: number;
  gameType: string;
  link: string;
  season: string;
  status: {
    abstractGameState: string;
    codedGameState: string;
    detailedState: string;
    startTimeTBD: string;
    statusCode: string;
  };
  teams: {
    away: {
      leagueRecord: {
        wins: number;
        losses: number;
        ot: number;
        type: string;
      };
      score: number;
      team: {
        id: number;
        name: string;
        link: string;
      };
    };
    home: {
      leagueRecord: {
        wins: number;
        losses: number;
        ot: number;
        type: string;
      };
      score: number;
      team: {
        id: number;
        name: string;
        link: string;
      };
    };
  };
  venues: {
    id: number;
    link: string;
    name: string;
  };
}

export class Schedule {
  date: string;
  event: Array<any>;
  games: Array<ScheduleGames> | ScheduleGames;
  totalEvents: number;
  totalGames: number;
  totalItems: number;
  totalMatches: number;
}

export class TodaySchedule {
  date: string;
  event: Array<any>;
  games: ScheduleGames;
  totalEvents: number;
  totalGames: number;
  totalItems: number;
  totalMatches: number;
}
