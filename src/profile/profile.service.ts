/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { S3PresignedUrl } from 'aws-sdk/clients/discovery';
import jwt_decode from "jwt-decode";

@Injectable()
export class ProfileService {
    private bucket: S3;
    private bucketName = this.configService.get('s3Bucket.profilePictureBucketName');

    constructor(private configService: ConfigService) {
        this.bucket = new S3()
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
