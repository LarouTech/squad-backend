export class GetTeamByIdDto {
    expand?: Expand;
    teamId?: number;
    stats?: string;
}

export enum Expand {
    roster = 'team.roster',
    rosterLess = 'person.names',
    scheduleNext = 'team.schedule.next',
    schedulePrevious = 'team.schedule.previous',
    teamStats = 'team.stats',
}