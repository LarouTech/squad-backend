/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';



export class LeagueId {
    
    @Prop()
    leagueId: string

    @Prop()
    isOwner?: boolean;

    @Prop()
    isConfirm?: boolean;

    @Prop()
    ownerId?: string;
}


export class Message {

    @Prop()
    dateCreated: string;

    @Prop()
    isRead: string;

    @Prop()
    message: string;

    @Prop()
    title: string
}


@Schema()
export class Profile extends Document {

    @Prop()
    cognitoId: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    email: string;

    @Prop()
    dateCreated: string;

    @Prop({type: LeagueId})
    leagues: LeagueId[];

    @Prop()
    socketId: string;

    @Prop()
    messages?: Message[]

}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
