/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SES } from 'aws-sdk';
import { SendEmailResponse } from 'aws-sdk/clients/ses';
import { Model } from 'mongoose';
import { Socket } from 'node:dgram';
import { AuthService } from 'src/auth/auth.service';
import { ProfileGateway } from 'src/profile/profile.gateway';
import { ProfileService } from 'src/profile/profile.service';
import { League, LeagueDocument } from './league.schema';
import { LeagueModel } from './model/league.model';

@Injectable()
export class LeagueService implements OnModuleInit {
    private simpleEmail = new SES({ region: 'us-east-1' });
    senderEmail: string;

    constructor(
        // private profileService: ProfileService,
        // private profileGateway: ProfileGateway,
        private configService: ConfigService,
        private authSrvice: AuthService,
        @InjectModel(League.name) private leagueModel: Model<LeagueDocument>) { }

    onModuleInit() {
        this.senderEmail = this.configService.get('amazonSes.sender');
    }

    //CREATE SQUAD LEAGUE IN MONGODB
    async createLeague(league: LeagueModel, bearer: string, socket: Socket): Promise<LeagueDocument> {
        const ownerId = await this.getUserId(bearer);
        league.ownerId = ownerId;

        const createLeague = new this.leagueModel(league);

        try {
            const league =  await createLeague.save();


            const isUserExist = league.GMs.gms.filter(g => g.isUserExist);
            const newUser = league.GMs.gms.filter(g => !g.isUserExist);

            // this.profileGateway.server.emit('joinLeagueNotificationEmitter', league)
            // console.log(league)

            return league




        } catch (error) {
            throw new NotFoundException(error);
        }


    }


    //DELETE LEAGUE BY ID
    async deleteLeagueById(id: string) {
        const result = this.leagueModel.deleteOne({ _id: id });
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

    //SEND EMAIL TO JOIN LEAGUE
    async sendEmailToJoinLeague(toAddress: string[], leagueName: string): Promise<SendEmailResponse> {
        const subject = `Check that - You have received an invite to play in a FanSquad league!!!`;
        const line1 = (`Hi ${toAddress}\n`).split('\n').join('<br>')
        const line2 = (`Please click the link below to join the league and compete agains your peer to become the DGof the year. Game on!\n`).split('\n').join('<br>');
        const line3 = `url test`

        const body = ((line1.concat(line2)).concat(line3));

        const result = this.simpleEmail.sendEmail({
            Destination: {
                ToAddresses: toAddress
            },
            Message: {
                Body: {
                    Html: {
                        Data: body
                    }
                },
                Subject: {
                    Data: subject
                }
            },
            Source: this.senderEmail

        }).promise()

        try {

            return await result;

        } catch (error) {
            throw new NotFoundException(error);
        }

    }

}
