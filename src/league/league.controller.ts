/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueModel } from './model/league.model';
import { Request } from 'express';
import { LeagueDocument } from './league.schema';
import { AuthorizerGuard } from 'src/auth/authorizer.guard';
import { SendEmailResponse } from 'aws-sdk/clients/ses';


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
        return this.leagueService.getMyLeagues(bearer)
    }

    @Delete('delete/:id')
    deleteLeagueById(@Param('id') id: string) {
        console.log(id)
        return this.leagueService.deleteLeagueById(id)
    }

    @Post('registration')
    sendEmail(@Body('toAddress') toAddress: string[]): Promise<SendEmailResponse> {
        console.log(toAddress)
        return this.leagueService.sendEmailToJoinLeague(toAddress, 'lesTaps')
    }
}
