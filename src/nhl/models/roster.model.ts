/* eslint-disable prettier/prettier */

import { Team } from "./team.model";

export interface Roster {
    id: string,
    person: {
        id: any,
        fullName: string,
        link: string
    },
    jerseyNumber: string,
    position: {
        code: string,
        name: string,
        type: string,
        abbreviation: string
    }
    team?: Team

}