/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";

export class Person {
    @Prop()
    id: number;

    @Prop()
    fullName: string;

    @Prop()
    link: string
}