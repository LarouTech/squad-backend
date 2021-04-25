/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";
import { PlayerStat } from "./player-stat.model";
import { StatsType } from "./stats-type.model";

export class Statistics {
    @Prop({ type: PlayerStat })
    stat: PlayerStat
}

export class Stats {
    @Prop({ type: StatsType })
    type: StatsType;

    @Prop({ type: Statistics, required: false })
    stats: Statistics;
}