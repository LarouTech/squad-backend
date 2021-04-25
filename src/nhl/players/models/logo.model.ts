/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class Logo {
    @Prop()
    id: number;

    @Prop()
    background: string;

    @Prop()
    endSeason: number;

    @Prop()
    secureUrl: string;

    @Prop()
    startSeason: number;

    @Prop()
    teamId: number;

    @Prop()
    url: string
}