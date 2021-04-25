/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class Conference {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    link: string
}