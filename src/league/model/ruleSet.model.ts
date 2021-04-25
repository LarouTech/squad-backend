/* eslint-disable prettier/prettier */
export interface RuleSetModel {
  players: {
    numberOfForward: Array<number>;
    numberOfDefence: Array<number>;
    numberOfGoalies: Array<number>;
  };
  scoring: {
    forwardGoalsPts: number;
    forwardAssistsPts: number;
    goalieWinPts: number;
    goalieShootoutPts: number;
    goaliesOTPts: number;
    goalieGoalsPts: number;
    goalieAssistsPts: number;
  };
}

// export interface RuleSetModel {
//   players: {
//     forward: {
//       max: number,
//       min: number
//     },
//     def: {
//       max: number,
//       min: number
//     },
//     goalies: {
//       max: number,
//       min: number
//     }
//   };
//   scoringSettings: {
//     forward: {
//       goals: number,
//       assists: number
//     },
//     def: {
//       goals: number,
//       assists: number
//     },
//     goalies: {
//       goals: number,
//       assists: number,
//       overtimeLost: number,
//       win: number,
//       shootout: number
//     }
//   }

// }
