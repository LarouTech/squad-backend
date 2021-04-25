/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";
import { GameType } from "./game-type.model";

export class StatsType {
    @Prop()
    displayName: string;

    @Prop({ type: GameType })
    gameType: GameType
    
}