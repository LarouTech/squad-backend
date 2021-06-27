/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthConfig } from './auth-config.model';
import { SignupDto } from './dto/signup.dto';
import { ConfirmSignupDto } from './dto/confirm.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';
import { HttpRequest } from 'aws-sdk';
import {
    AdminInitiateAuthResponse,
    ConfirmForgotPasswordResponse,
    ConfirmSignUpResponse,
    ForgotPasswordResponse,
    GetUserResponse,
    GlobalSignOutResponse,
    InitiateAuthResponse,
    ListUsersResponse,
    SignUpResponse,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('config')
    getAuthConfig(): AuthConfig {
        return this.authService.cognitoConfig;
    }

    @Post('signin')
    signup(@Body() signupDto: SignupDto): Promise<SignUpResponse> {
        return this.authService.signin(signupDto);
    }

    @Post('confirm-signin')
    confirmmSignup(
        @Body() confirmSignupDto: ConfirmSignupDto,
    ): Promise<ConfirmSignUpResponse> {
        return this.authService.confirmSignin(confirmSignupDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<AdminInitiateAuthResponse> {
        console.log('barnouche')
        return this.authService.login(loginDto);
    }

    @Post('forgot-password')
    forgotPassword(
        @Body() forgotPasswordDto: ForgotPasswordDto,
    ): Promise<ForgotPasswordResponse> {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('confirm-forgot-password')
    confirmForgotPassword(
        @Body() confirmForgotPasswordDto: ConfirmForgotPasswordDto,
    ): Promise<ConfirmForgotPasswordResponse> {
        return this.authService.confirmForgotPassword(confirmForgotPasswordDto);
    }

    @Post('logout')
    logout(@Body() token: any): Promise<GlobalSignOutResponse> {
        return this.authService.logout(token);
    }

    @Post('refresh-token')
    refreshTokens(@Body() refreshToken: any):
    Promise<InitiateAuthResponse> {
        return this.authService.refreshTokens(refreshToken);
    }

    @Get('get-user')
    getUserByToken(@Req() res: HttpRequest): Promise<GetUserResponse> {
        const bearerToken = res.headers.authorization;
        return this.authService.getUserByBearerToken(bearerToken);
    }

    @Get('list-users')
    listUsers(): Promise<ListUsersResponse>  {
        return this.authService.listUsers()
    }

    @Get('user-by-id/:id')
    getUserById(@Param('id') id: string) {
        return this.authService.getUserById(id)
    }
}
