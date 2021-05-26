/* eslint-disable prettier/prettier */
export class OverallRecords {
  losses: number;
  ot: number;
  type: string;
  wins: number;
}


export class TeamRecords {
  clinchIndicator: string;
  conferenceHomeRank: string;
  conferenceL10Rank: string;
  conferenceRank: string;
  conferenceRoadRank: string;
  divisionHomeRank: string;
  divisionL10Rank: string;
  divisionRank: string;
  divisionRoadRank: string;
  gamesPlayed: number;
  goalsAgainst: number;
  goalsScored: number;
  lastUpdated: Date;
  leagueHomeRank: string;
  leagueL10Rank: string;
  leagueRank: string;
  leagueRecord: OverallRecords;
  leagueRoadRank: string;
  points: number;
  pointsPercentage: number;
  ppConferenceRank: string;
  ppDivisionRank: string;
  ppLeagueRank: string;
  records: {
    overallRecords: OverallRecords[]
  };
  regulationWins: number;
  row: number;
  streak: {
    streakCode: string,
    streakNumber: number,
    streakType: string
  };
  team: {
    name: string,
    id: number,
    link: string
  };
  wildCardRank: string
}


export class Standings {
  conference: {
    name: string,
    id: number,
    link: string
  };
  division: {
    name: string,
    id: number,
    link: string
  };
  league: {
    name: string,
    id: number,
    link: string
  };
  season: string;
  standingsType: string;
  teamRecords: TeamRecords[];
}
