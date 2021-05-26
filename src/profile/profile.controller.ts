/* eslint-disable prettier/prettier */
import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpRequest } from 'aws-sdk';

@Controller('profile')
export class ProfileController {


  @Post('upload-picture')
  @UseInterceptors(FileInterceptor('profile-picture'))
  uploadProfilePicture(@Req() req: HttpRequest, @UploadedFile() file: any) {
    console.log(file)
    
  }

}
