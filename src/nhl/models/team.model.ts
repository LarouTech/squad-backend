/* eslint-disable prettier/prettier */

export interface Logos {
    id: number,
    background: string,
    endSeason: number,
    secureUrl: string,
    startSeason: number,
    teamId: number,
    url: string
}

export interface TeamStats {
    stats: {
        ranking: {
            wins: string,
            losses: string,
            ot: string,
            pts: string,
            ptPctg: string,
            goalsPerGame: string,
            goalsAgainstPerGame: string,
            evGGARatio: string,
            powerPlayPercentage: string,
            powerPlayGoals: string,
            powerPlayGoalsAgainst: string,
            powerPlayOpportunities: string,
            penaltyKillOpportunities: string,
            penaltyKillPercentage: string,
            shotsPerGame: string,
            shotsAllowed: string,
            winScoreFirst: string,
            winOppScoreFirst: string,
            winLeadFirstPer: string,
            winLeadSecondPer: string,
            winOutshootOpp: string,
            winOutshotByOpp: string,
            faceOffsTaken: string,
            faceOffsWon: string,
            faceOffsLost: string,
            faceOffWinPercentage: string,
            savePctRank: string,
            shootingPctRank: string,
        }
        stats: {
            gamesPlayed: number | string,
            wins: number | string,
            losses: number | string,
            ot: number | string,
            pts: number | string,
            ptPctg: number | string,
            goalsPerGame: number | string,
            goalsAgainstPerGame: number | string,
            evGGARatio: number | string,
            powerPlayPercentage: number | string,
            powerPlayGoals: number | string,
            powerPlayGoalsAgainst: number | string,
            powerPlayOpportunities: number | string,
            penaltyKillPercentage: number | string,
            shotsPerGame: number | string,
            shotsAllowed: number | string,
            winScoreFirst: number | string,
            winOppScoreFirst: number | string,
            winLeadFirstPer: number | string,
            winLeadSecondPer: number | string,
            winOutshootOpp: number | string,
            winOutshotByOpp: number | string,
            faceOffsTaken: number | string,
            faceOffsWon: number | string,
            faceOffsLost: number | string,
            faceOffWinPercentage: number | string,
            shootingPctg?: number | string,
            savePctg?: number | string
            savePctRank: string,
            shootingPctRank?: string
        }
    },
}

export interface Team {
    id: number,
    name: string,
    link: string,
    venue: {
        name: string,
        link: string,
        city: string,
        timeZone: {
            id: string,
            offset: number,
            tz: string
        }
    }
    abbreviation: string,
    teamName: string,
    locationName: string,
    firstYearOfPlay: string,
    division: {
        id: number,
        name: string,
        link: string
    },
    conference: {
        id: number,
        name: string,
        link: string
    },
    franchise: {
        id: number,
        name: string,
        link: string
    }
    shortName: string,
    officialSiteUrl: string,
    franchiseId: number,
    active: boolean,
    logos?: {
        dark: Logos
        light: Logos,
        alt: Logos
    }
    stats?: TeamStats
}