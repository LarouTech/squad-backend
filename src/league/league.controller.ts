/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueModel } from './model/league.model';
import { Request } from 'express';
import { LeagueDocument } from './league.schema';


// @UseGuards(AuthorizerGuard)
@Controller('league')
export class LeagueController {

    constructor(private leagueService: LeagueService) { }

    @Post('create')
    createLeague(
        @Req() req: Request,
        @Body() league: LeagueModel): Promise<LeagueDocument> {
        const bearer = req.headers.authorization;
        return this.leagueService.createLeague(league, bearer);
    }

    @Get('my-league')
    getMyLeague(@Req() req: Request): Promise<LeagueDocument[]> {
        const bearer = req.headers.authorization;
        return this.leagueService.getMyLeague(bearer)
    }
}
