/* eslint-disable prettier/prettier */
import { DgModel } from "./dg.model";
import { KeyDatesModel } from "./keyDates.model";
import { LeagueInfoModel } from "./leagueInfo.model";
import { RuleSetModel } from "./ruleSet.model";

export interface LeagueModel {
  leagueInfo?: LeagueInfoModel,
  rules?: RuleSetModel,
  keyDates?: KeyDatesModel,
  GMs?: DgModel,
  ownerId: string,
}
