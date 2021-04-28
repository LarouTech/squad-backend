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

export class LogosModel {
    @Prop({type: Logo})
    dark: Logo;

    @Prop({type: Logo})
    light: Logo;

    @Prop({type: Logo, required: false})
    alt?: Logo;
}