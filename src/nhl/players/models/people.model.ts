/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class People  {
    @Prop()
    id: number;
    
    @Prop()
    fullName: string;

    @Prop()
    link: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    primaryNumber: number;

    @Prop()
    birthDate: string;

    @Prop()
    currentAge: number;

    @Prop()
    birthCity: string;

    @Prop()
    birthStateProvince: string;

    @Prop()
    birthCountry:  string;

    @Prop()
    nationality: string;

    @Prop()
    height: string;

    @Prop()
    weight: number;

    @Prop()
    active: boolean;

    @Prop()
    alternateCaptain: boolean;

    @Prop()
    captain: boolean;

    @Prop()
    rookie: boolean;

    @Prop()
    shootsCatches: string;

    @Prop()
    rosterStatus: string;
}

export const PeopleSchema = SchemaFactory.createForClass(People);