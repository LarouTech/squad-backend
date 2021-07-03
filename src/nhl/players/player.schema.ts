/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Person } from "./models/person.model";
import { Position } from "./models/position.model";
import { TeamInfo } from "./models/team-info.model";
import { Stats } from "./models/statistics.model";
import { People, PeopleSchema } from "./models/people.model";

// export type PlayerDocument = Player & Document;

@Schema()
export class Player extends Document {
    @Prop({ type: Stats, required: false })
    stats: Stats;

    @Prop()
    id: string;

    @Prop({ type: Person })
    person: Person;

    @Prop()
    jerseyNumber: string;

    @Prop({ type: Position })
    position: Position;

    @Prop({ type: TeamInfo })
    team: TeamInfo;

    @Prop()
    headshot: string;

    @Prop()
    actionshot: string;

    @Prop({type: PeopleSchema})
    people: People

}

export const PlayerSchema = SchemaFactory.createForClass(Player);