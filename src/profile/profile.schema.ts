/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';



export class LeagueId {
    
    @Prop()
    leagueId: string
}


@Schema()
export class Profile extends Document {

    @Prop()
    cognitoId: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({type: LeagueId})
    leagues: LeagueId[];

}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
