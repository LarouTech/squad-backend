/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class Division {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    link: string
}