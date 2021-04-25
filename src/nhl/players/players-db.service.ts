/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { Players } from '../models/players.model';
import { NhlService } from '../nhl.service';
import { Player, PlayerDocument } from './player.schema';

@Injectable()
export class PlayersDbService {

    constructor(
        @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
        private nhlService: NhlService) { }

    //PRIVATE GET ALL PLAYERS FROM MONGODB
    // async getAllPlayersFromMongo() {
        

    // }

    //SAVE OR UPDATE PLAYER COLLECTION CONTROLLER
    async savePlayersToMongoController() {
        const allPlayers = await this.getPlayersPromisify();

        try {
            allPlayers.forEach(player => {
                this.saveOrUpdatePlayerRecords(player)
            })

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
            } else {
                this.playerModel.updateOne({ _id: playerExist[0]._id });
            }

        } catch (error) {
            throw new NotFoundException(error);
        }

    }

    //TRANSFORM GET ALL PLAYERS TO PROMISE
    private async getPlayersPromisify(): Promise<Players[]> {
        let playersObj: Players[];

        try {
            await this.nhlService.getAllPlayers().toPromise()
                .then(players => {
                    playersObj = players;
                })
        } catch (error) {
            throw new NotFoundException('getPlayersPromisify');
        }

        return playersObj;
    }

    //FIND PLAYER IN MONGO BY NHL PLAYER ID
    private async findPlayerByNhlId(id: string): Promise<PlayerDocument[]> {
        const player: Query<PlayerDocument[], PlayerDocument> = this.playerModel.find({ id: id });

        try {
            return await player;
        } catch (error) {
            throw new NotFoundException('findPlayerByNhlId');
        }
    }


}
