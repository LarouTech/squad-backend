/* eslint-disable prettier/prettier */
import { Prop } from "@nestjs/mongoose";
import { Conference } from "./conference.model";
import { Division } from "./division.model";
import { Franchise } from "./franchise.model";
import { Venue } from "./venue.model";

export class TeamInfo {
    @Prop()
    id: number;

    @Prop()
    name: string;

    @Prop()
    link: string;

    @Prop({ type: Venue })
    venue: Venue

    @Prop()
    abbreviation: string;

    @Prop()
    teamName: string;

    @Prop()
    locationName: string;

    @Prop()
    firstYearOfPlay: string;

    @Prop({ type: Division })
    division: Division;

    @Prop({ type: Conference })
    conference: Conference

    @Prop({ type: Franchise })
    franchise: Franchise;

    @Prop()
    shortName: string;

    @Prop()
    officialSiteUrl: string;

    @Prop()
    franchiseId: number;

    @Prop()
    active: boolean;
}