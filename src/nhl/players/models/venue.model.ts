/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";
import { Timezone } from "./timezone.model";

export class Venue {
    @Prop()
    name: string;

    @Prop()
    link: string;

    @Prop()
    city: string;

    @Prop({ type: Timezone })
    timeZone: Timezone
}