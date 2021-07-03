/* eslint-disable prettier/prettier */
export class Period {
  away: {
    goals: number,
    rinkSide: string,
    shotOnGoal: number
  }
  endTime: Date;
  home: {
    goals: number,
    rinkSide: string,
    shotOnGoal: number
  };
  num: number;
  ordinalNum: string;
  periodeType: string;
  startTime: Date
}

export class LineScore {
  currentPeriod: number;
  currentPeriodOrdinal: string;
  currentPeriodTimeRemaining: string;
  hasShootout: boolean;
  intermissionInfo: {
    inIntermission: boolean,
    intermissionTimeElapsed: number,
    intermissionTimeRemaining: number
  };
  periods: Period[];
  powerPlayInfo: {
    inSituation: boolean,
    situationTimeElapsed: number,
    situationTimeRemaining: number
  }
  powerPlayStrength: string
  shootoutInfo: {
    away: {
      attempts: number;
      scores: number
    };
    home: {
      attempts: number;
      scores: number
    }
  };
  teams: {
    away: {
      goaliePulled: boolean,
      goals: number,
      numSkaters: number,
      powerPlay: boolean,
      shotsOnGoal: number
      team: {
        id: number,
        name: string,
        link: string
      }
    };
    home: {
      goaliePulled: boolean,
      goals: number,
      numSkaters: number,
      powerPlay: boolean,
      shotsOnGoal: number
      team: {
        id: number,
        name: string,
        link: string
      }
    };
  }


}

export class ScheduleGames {
  content: {
    link: string;
  };
  gameDate: Date;
  gamePk: number;
  gameType: string;
  linescore?: LineScore
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
        logos?: any
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
        logos?: any
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
