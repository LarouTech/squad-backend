/* eslint-disable prettier/prettier */
import { HttpService, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CognitoIdentityServiceProvider, S3 } from 'aws-sdk';
import { AdminUpdateUserAttributesResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { S3PresignedUrl } from 'aws-sdk/clients/discovery';
import jwt_decode from "jwt-decode";
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthConfig } from 'src/auth/auth-config.model';
import { Profile } from './profile.schema';

@Injectable()
export class ProfileService implements OnModuleInit {
    private bucket: S3;
    private bucketName = this.configService.get('s3Bucket.profilePictureBucketName');
    private cognitoClient: CognitoIdentityServiceProvider;
    cognitoConfig: AuthConfig;
    private backend = `https://${this.configService.get('auth.config')}`

    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        private httpService: HttpService,
        private configService: ConfigService) {
        this.bucket = new S3();
        this.cognitoClient = new CognitoIdentityServiceProvider({
            region: this.configService.get('auth.region')
        });
    }

    onModuleInit(): void {
        const name = {
            poolName: this.configService.get('auth.poolName')
        };
        this.getAuthConfig(name).subscribe((config: AuthConfig) => {
            this.cognitoConfig = config;
        });
    }

    //GET AUTH CONFIG FROM SERVERLESS LAMBDA
    private getAuthConfig(name: any): Observable<AuthConfig> {
        const { poolName } = name;
        return this.httpService
            .post<AuthConfig>(this.backend, { poolName: poolName })
            .pipe(
                map((res: any) => {
                    return res.data;
                }),
                catchError((error) => {
                    throw new NotFoundException(error);
                }),
            );
    }

    //GET PROFILE BY ID
    async getProfile(id: string): Promise<Profile[]> {
        const profile = this.profileModel.find({ _id: id });

        try {
            return await profile;
        } catch (error) {
            console.log(error)
            throw new NotFoundException(error);
        };
    }

    //CREATE USER PROFILE
    async createProfile(profile: Profile): Promise<Profile> {
        const createProfile = new this.profileModel(profile);

        try {
             return await createProfile.save();
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //LINK PROFILE TO COGNITO
    async linkProfileToCognito(id: string, token: string): Promise<AdminUpdateUserAttributesResponse> {
        const decoded = jwt_decode(token)
        const sub = decoded['sub'];
        
        const result = this.cognitoClient.adminUpdateUserAttributes({
            UserAttributes: [
                {
                    Name: 'custom:profileId',
                    Value: id
                },
            ],
            UserPoolId: this.cognitoConfig.userPool.Id,
            Username: sub
        }).promise()

        try {
            return await result;
        } catch (error) {
            console.log(error)
            throw new NotFoundException(error);
        };

    }

    //UPLOAD PROFILE PICTURE TO S3 BUCKET BY BEARER TOKEN
    async uploadFileToBucket(file: any, token?: string): Promise<{ signedUrl: S3PresignedUrl }> {
        const signedUrlExpireSeconds = 60 * 60;
        const decoded = jwt_decode(token);

        const params = {
            Bucket: this.bucketName,
            Body: file.buffer,
            Key: `profile-picture-${decoded['username']}.jpeg`,
        };

        const result = this.bucket.putObject(params).promise();

        const url = this.bucket.getSignedUrlPromise('getObject', {
            Bucket: this.bucketName,
            Key: `profile-picture-${decoded['username']}.jpeg`,
            Expires: signedUrlExpireSeconds,
        });

        try {
            await result;
            return { signedUrl: await url };
        } catch (error) {
            console.log(error)
            throw new NotFoundException(error);
        };
    }

    //GET PROFILE PICTURE FROM S3 BUCKET BY BEARER TOKEn
    async getProfilePictureFromS3(token: string): Promise<{ signedUrl: S3PresignedUrl }> {
        const signedUrlExpireSeconds = 60 * 60;
        const decoded = jwt_decode(token);

        const params = {
            Bucket: this.bucketName,
            Key: `profile-picture-${decoded['username']}.jpeg`,
        };

        const url = this.bucket.getSignedUrlPromise('getObject', {
            ...params,
            Expires: signedUrlExpireSeconds,
        });

        try {
            await this.bucket.getObject(params).promise();
            return { signedUrl: await url };
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //DELETE PROFILE PICTURE FROM S3 BY BEARER TOKEn
    async deleteProfilePictureFromS3(token: string) {
        const decoded = jwt_decode(token);
        const params = {
            Bucket: this.bucketName,
            Key: `profile-picture-${decoded['username']}.jpeg`,
        };

        const result = this.bucket.deleteObject(params).promise()

        try {
            return (await result);
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //EXTRACT TOKEN STRING FROM BEARER TOKEN
    extractToken(bearer: string): string {
        if (!bearer) {
            throw new UnauthorizedException();
        }
        const token = bearer.split(' ')[1];
        return token;
    }


}
