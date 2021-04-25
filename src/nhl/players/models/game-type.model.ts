/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class GameType {
    @Prop()
    id: string;

    @Prop()
    description: string;

    @Prop()
    postseason: string
}