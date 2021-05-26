/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { League, LeagueDocument } from './league.schema';
import { LeagueModel } from './model/league.model';

@Injectable()
export class LeagueService {

    constructor(
        private authSrvice: AuthService,
        @InjectModel(League.name) private leagueModel: Model<LeagueDocument>) { }


    //CREATE SUAD LEAGUE IN MONGODB
    async createLeague(league: LeagueModel, bearer: string): Promise<LeagueDocument> {
        const ownerId = await this.getUserId(bearer);
        league.ownerId = ownerId;

        const createLeague = new this.leagueModel(league);

        try {
            return await createLeague.save();
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //DELETE LEAGUE BY ID
    async deleteLeagueById(id: string) {
        const result = this.leagueModel.deleteOne({_id: id});
        try {
            return {
                ... await result,
                _id: id
            };

        } catch (error) {
            console.log(error)
            throw new NotFoundException(error);
        }
    }

    //GET MY LEAGUE     
    async getMyLeagues(bearer: string): Promise<LeagueDocument[]> {
        const userId = await this.getUserId(bearer)
        const leagues = this.leagueModel.find({ ownerId: userId });

        try {
            return await leagues;

        } catch (error) {
            console.log(error)
            throw new NotFoundException(error);
        }
    }

    //GET USERID BY BEARER TOKEN FROM AUTH SERVICE
    private async getUserId(bearer: string): Promise<string> {
        try {
            return (await this.authSrvice.getUserByBearerToken(bearer)).Username;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }
}
