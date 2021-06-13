/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type LeagueDocument = League & Document;

class LeagueInfo {
    @Prop({})
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    nickName: string;

    @Prop()
    poolName: string;

    @Prop()
    salaryCap: number;

    @Prop()
    injuriesAllowed: number;

    @Prop()
    waiverPerMonths: number;

    @Prop({ required: false })
    logo: string;
}

class PlayerRules {
    @Prop([Number])
    numberOfForward: number[];

    @Prop([Number])
    numberOfDefence: number[];

    @Prop([Number])
    numberOfGoalies: number[];
}

class ScoringRules {
    @Prop()
    forwardGoalsPts: number;

    @Prop()
    forwardAssistsPts: number;

    @Prop()
    goalieAssistsPts: number;

    @Prop()
    goalieGoalsPts: number;

    @Prop()
    goalieWinPts: number;

    @Prop()
    goalieShootoutPts: number;

    @Prop()
    goaliesOTPts: number;
}

class Rules {
    @Prop({ type: PlayerRules })
    players: PlayerRules;

    @Prop({ type: ScoringRules })
    scoring: ScoringRules;
}

class KeyDates {
    @Prop(Date)
    seasonStartDate: Date;

    @Prop(Date)
    seasonEndDate: Date;

    @Prop(Date)
    playoffStartDate: Date;

    @Prop(Date)
    draftDate: Date;

    @Prop(Date)
    tradeDeadline: Date;
}

class GMsProp {
    @Prop()
    email: string;

    @Prop()
    isUserExist: boolean;

    @Prop()
    confirmed: boolean;
}

class GMs {
    @Prop([GMsProp])
    gms: GMsProp[];
}

@Schema()
export class League extends Document {

    @Prop()
    ownerId: string;

    @Prop({ type: LeagueInfo })
    leagueInfo: LeagueInfo

    @Prop({ type: Rules })
    rules: Rules;

    @Prop({ type: KeyDates })
    keyDates: KeyDates;

    @Prop({ type: GMs })
    GMs: GMs;

}

export const LeagueSchema = SchemaFactory.createForClass(League);
