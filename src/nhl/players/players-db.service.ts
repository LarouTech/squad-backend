/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model, Query } from 'mongoose';
import { Players } from '../models/players.model';
import { NhlService } from '../nhl.service';
import { Player } from './player.schema';

@Injectable()
export class PlayersDbService {

    constructor(
        @InjectModel(Player.name) private playerModel: Model<Player>,
        private nhlService: NhlService) { }

    //PRIVATE GET ALL PLAYERS FROM MONGODB
    async getAllPlayersFromMongo() {

        try {
            const players = await this.playerModel.find()
            return players

        } catch (error) {
            throw new NotFoundException(error);
        }

    }

    //SAVE OR UPDATE PLAYER COLLECTION CONTROLLER
    //CRON JOB RUNNNING DAILY AT 6:00AM
    @Cron('0 00 6 * * *')
    async savePlayersToMongoController() {
        const allPlayers = await this.getPlayersPromisify();

        try {
            allPlayers.forEach(player => {
                this.saveOrUpdatePlayerRecords(player)
            })

            console.log({ message: 'PLAYER collection has been updated in mongodb' })
            return {
                message: 'PLAYER collection has been updated in mongodb',
            }
        } catch (error) {
            throw new NotFoundException(error);
        }

    }

    //SAVE NEW PLAYER OR UPDATE IF EXIST IN MONGODB 
    private async saveOrUpdatePlayerRecords(player: Players) {
        const playerDataModel = new this.playerModel(player);
        const playerExist = await this.findPlayerByNhlId(player.id);

        try {
            if (!playerExist.length) {
                playerDataModel.save();
                return player
            } else {


                this.playerModel.findOneAndUpdate({ _id: playerExist[0]._id }, {
                    _stats: player.stats
                })
            }

        } catch (error) {
            throw new NotFoundException(error);
        }

    }

    // //SAVE NEW PLAYER OR UPDATE IF EXIST IN MONGODB 
    // private async saveOrUpdatePlayerRecords(player: Players) {
    //     const playerDataModel = new this.playerModel(player);
    //     const playerExist = await this.findPlayerByNhlId(player.id);

    //     try {
    //         if (!playerExist.length) {
    //             playerDataModel.save();
    //             return player
    //         } else {
    //             console.log('test')
    //             this.playerModel.updateOne({ _id: playerExist[0]._id });
    //         }

    //     } catch (error) {
    //         throw new NotFoundException(error);
    //     }

    // }

    //TRANSFORM GET ALL PLAYERS TO PROMISE FROM OBSERVABLE
    private async getPlayersPromisify(): Promise<Players[]> {
        let playersObj: Players[];

        try {
            await this.nhlService.getAllPlayers().toPromise()
                .then(players => {
                    playersObj = players;
                })
        } catch (error) {
            throw new NotFoundException(error.response);
        }

        return playersObj;
    }

    //FIND PLAYER IN MONGO BY NHL PLAYER ID
    private async findPlayerByNhlId(id: string): Promise<Player[]> {
        const player: Query<Player[], Player> = this.playerModel.find({ id: id });

        try {
            return await player;
        } catch (error) {
            throw new NotFoundException('findPlayerByNhlId');
        }
    }


}
