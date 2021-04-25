/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class Franchise {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    link: string
}