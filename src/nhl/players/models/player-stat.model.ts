/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class PlayerStat {
    @Prop()
    timeOnIce: string;

    @Prop()
    assists: number;

    @Prop()
    goals: number;

    @Prop()
    pim: number;

    @Prop()
    shots: number;

    @Prop()
    games: number;

    @Prop()
    hits: number;

    @Prop()
    powerPlayGoals: number;

    @Prop()
    powerPlayPoints: number;

    @Prop()
    powerPlayTimeOnIce: string;

    @Prop()
    evenTimeOnIce: string;

    @Prop()
    penaltyMinutes: number;

    @Prop()
    faceOffPct: number;

    @Prop()

    @Prop()
    shotPct: string;

    @Prop()
    gameWinningGoals: number;

    @Prop()
    overTimeGoals: number;

    @Prop()
    shortHandedGoals: number;

    @Prop()
    shortHandedPoints: number;

    @Prop()
    shortHandedTimeOnIce: string;

    @Prop()
    blocked: number;

    @Prop()
    plusMinus: number;

    @Prop()
    points: number;

    @Prop()
    shifts: number;

    @Prop()
    timeOnIcePerGame: string;

    @Prop()
    evenTimeOnIcePerGame: string;

    @Prop()
    shortHandedTimeOnIcePerGame: string;

    @Prop()
    powerPlayTimeOnIcePerGame: string
}