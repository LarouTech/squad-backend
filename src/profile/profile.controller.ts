/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpRequest } from 'aws-sdk';
import { AdminUpdateUserAttributesResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { S3PresignedUrl } from 'aws-sdk/clients/discovery';
import { AuthorizerGuard } from 'src/auth/authorizer.guard';
import { Profile } from './profile.schema';
import { ProfileService } from './profile.service';

@UseGuards(AuthorizerGuard)
@Controller('profile')
export class ProfileController {

  constructor(private profileService: ProfileService) { }

  @Post('create')
  createProfile(@Body() profile: Profile): Promise<Profile> {
    return this.profileService.createProfile(profile)
  }

  @Get('link/:id')
  linkProfileToCognito(
    @Req() req: HttpRequest,
    @Param('id') profileId: string): Promise<AdminUpdateUserAttributesResponse> {
    const token = this.profileService.extractToken(req.headers.authorization);
    return this.profileService.linkProfileToCognito(profileId, token)
  }

  @Get(':id')
  getProfile(@Param('id') id: string): Promise<Profile[]> {
    return this.profileService.getProfile(id)
  }

  @Post('post/picture')
  @UseInterceptors(FileInterceptor('profile-picture'))
  uploadProfilePicture(@Req() req: HttpRequest, @UploadedFile() file: any): Promise<{ signedUrl: S3PresignedUrl }> {
    const token = this.profileService.extractToken(req.headers.authorization);
    return this.profileService.uploadFileToBucket(file, token);
  }

  @Get('get/picture')
  getProfilePictureFromS3(@Req() req: HttpRequest): Promise<{ signedUrl: S3PresignedUrl }> {
    const token = this.profileService.extractToken(req.headers.authorization);
    return this.profileService.getProfilePictureFromS3(token)
  }

  @Delete('delete/picture')
  deleteProfilePictureFromS3(@Req() req: HttpRequest) {
    const token = this.profileService.extractToken(req.headers.authorization);
    return this.profileService.deleteProfilePictureFromS3(token);
  }

}
