/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class Position {
    @Prop()
    code: string;

    @Prop()
    name: string;

    @Prop()
    type: string;

    @Prop()
    abbreviation: string
}