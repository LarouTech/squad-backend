/* eslint-disable prettier/prettier */
import { String } from 'aws-sdk/clients/cloudsearch';
import { Team } from 'src/nhl/models/team.model';
import { People } from './people.model';
import { LineScore } from './schedule.model';

export class Officials {
  official: {
    fullName: string;
    id: number;
    link: string;
  };
  officialType: string;
}

export class Coaches {
  person: {
    fullName: string;
    link: string;
  };
  position: {
    code: string;
    name: string;
    type: string;
    abbreviation: string;
  };
}

export class OnIcePlus {
  playerId: number;
  shiftDuration: number;
  stamina: number;
}

export class PenalityBox {
  id: number;
  timeRemaining: string;
  active: boolean;
}

export class SkaterStats {
  skaterStats: {
    assists: number;
    blocked: number;
    evenTimeOnIce: string;
    faceOffPct: number;
    faceOffWins: number;
    faceoffTaken: number;
    giveaways: number;
    goals: number;
    hits: number;
    penalityMinutes: number;
    plusMinus: number;
    powerPlayAssists: number;
    powerPlayGoasl: number;
    powerPlayTimeOnIce: number;
    shortHandedAssists: number;
    shortHandedGoals: number;
    shortHandedTimeOnIce: string;
    shots: number;
    takeaways: number;
    timeOnIce: string;
  };
}

export class GoalieStats {
  goalieStats: {
    assists: number;
    decision: string;
    evenSaves: number;
    evenShotsAgainst: number;
    evenStrengthSavePercentage: number;
    goals: number;
    pim: number;
    powerPlaySavePercentage: number;
    powerPlaySaves: number;
    powerPlayShotsAgainst: number;
    savePercentage: number;
    saves: number;
    shortHandedSavePercentage: number;
    shortHandedSaves: number;
    shortHandedShotsAgainst: number;
    shots: number;
    timeOnIce: string;
  };
}

export class PlayersBoxScore {
  jerseyNumber: string;
  person: {
    fullName: string;
    id: number;
    link: string;
    rosterStatus: string;
    shootCatches: string;
  };
  position: {
    abbreviation: string;
    code: string;
    name: string;
    type: string;
  };
  stats: SkaterStats | GoalieStats;
}

export class TeamsGameStats {
  coaches: Coaches;
  goalies: number[];
  onIce: number[];
  onIcePlus: OnIcePlus[];
  penalityBox: PenalityBox[];
  players: PlayersBoxScore;
  scrateches: number[];
  skaters: number[];
  team: {
    abbreviation: string;
    id: number;
    link: string;
    name: string;
    triCode: string;
  };
  teamStats: {
    teamSDkaterStats: {
      blocked: number;
      faceOffWinPercentage: string;
      giveaways: number;
      goals: number;
      hits: number;
      pim: number;
      powerPlayGoals: number;
      powerPlayOpportunities: number;
      powerPlayPercentage: string;
      shots: number;
      takeaways: number;
    };
  };
}

export class PropGeneric {
  fullName: string;
  id: number;
  link: string;
}

export class PlayerGamePlay {
  player: PropGeneric;
  playerType: string;
}

export class GamePlay {
  about?: {
    dateTime?: Date;
    eventId?: number;
    eventIdx?: number;
    goals?: {
      away?: number;
      home?: number;
    };
    ordinalNum?: string;
    period?: number;
    periodTime?: string;
    periodTimeRemaining?: string;
    periodeType?: string;
  };
  coordinates?: {
    x: number;
    y: number;
  };
  players?: PlayerGamePlay[];
  result?: {
    description: string;
    event: string;
    eventCode: string;
    veentTypeId: string;
  };
  team?: {
    id: number;
    link: string;
    name: string;
    triCode: string;
  };
}

export class PlaysByPeriod {
  stratIndex: number;
  endIndex: number;
  plays: number[];
}

//CHU RENDU LA - APRES PENALITY BOX
export class LiveData {
  boxscore: {
    officials: Officials[];
    teams: {
      away: TeamsGameStats;
      home: TeamsGameStats;
    };
  };
  decisions: {
    firstStar: PropGeneric;
    seconStar: PropGeneric;
    thirdStar: PropGeneric;
    winner: PropGeneric;
    loser: PropGeneric;
  };
  linescore: LineScore;
  plays: {
    allPlays: GamePlay[];
    currentPlay: GamePlay;
    penalityPlays: number[];
    playsByPeriod: PlaysByPeriod;
    scoringPlays: number[];
  };
}

export class GameDetails {
  gameData: {
    datetime: {
      datetime: Date;
    };
    game: {
      pk: number;
      season: string;
      type: string;
    };
    players: People[];
    status: {
      abstractGameState: string;
      codedGameState: string;
      detailedState: string;
      startTimeTBD: boolean;
      statusCode: string;
    };
    teams: {
      away: Team;
      home: Team;
    };
    venue: {
      id: number;
      name: string;
      link: string;
    };
  };
  link: string;
  liveData: LiveData;
  metaData: {
    wait: number;
    timeStamp: string;
  };
}
