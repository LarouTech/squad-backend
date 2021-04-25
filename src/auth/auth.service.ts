/* eslint-disable prettier/prettier */
import { HttpService, Injectable, NotFoundException, OnModuleInit, UnauthorizedException, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AuthConfig } from './auth-config.model';
import { catchError, map } from 'rxjs/operators';
import { SignupDto } from './dto/signup.dto';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AdminInitiateAuthResponse, ConfirmForgotPasswordResponse, ConfirmSignUpResponse, ForgotPasswordResponse, GetUserResponse, GlobalSignOutResponse, InitiateAuthResponse, ListUsersResponse, SignUpResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { ConfirmSignupDto } from './dto/confirm.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';

@Injectable()
export class AuthService implements OnModuleInit {
    cognitoConfig: AuthConfig;
    private backend = `https://${this.configService.get('auth.config')}`
    private cognitoClient: CognitoIdentityServiceProvider;

    constructor(
        private configService: ConfigService,
        private httpService: HttpService) {
        this.cognitoClient = new CognitoIdentityServiceProvider({
            region: this.configService.get('auth.region')
        });
    }

    onModuleInit() {
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

    //SIGNIN TO COGNITO USER POOL
    async signin(signUpDto: SignupDto): Promise<SignUpResponse> {
        const result: Promise<SignUpResponse> = this.cognitoClient
            .signUp({
                ClientId: this.cognitoConfig.appClient.ClientId,
                Password: signUpDto.password,
                Username: signUpDto.email,
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: signUpDto.email,
                    },
                    {
                        Name: 'custom:firstName',
                        Value: signUpDto.firstName,
                    },
                    {
                        Name: 'custom:lastName',
                        Value: signUpDto.lastName,
                    },
                ],
            })
            .promise();

        try {
            return await result;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    //CONFIRM SIGNIN FROM COGNITO USER POOL
    async confirmSignin(
        confirmSignupDto: ConfirmSignupDto,
    ): Promise<ConfirmSignUpResponse> {
        const result: Promise<ConfirmSignUpResponse> = this.cognitoClient
            .confirmSignUp({
                ClientId: this.cognitoConfig.appClient.ClientId,
                ConfirmationCode: confirmSignupDto.code,
                Username: confirmSignupDto.username,
            })
            .promise();

        try {
            return await result;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    //LOGIN TO COGNITO USER POOL
    async login(loginDto: LoginDto): Promise<AdminInitiateAuthResponse> {
        const result: Promise<AdminInitiateAuthResponse> = this.cognitoClient
            .adminInitiateAuth({
                AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
                ClientId: this.cognitoConfig.appClient.ClientId,
                AuthParameters: {
                    USERNAME: loginDto.email,
                    PASSWORD: loginDto.password,
                },
                UserPoolId: this.cognitoConfig.userPool.Id,
            })
            .promise();

        try {
            return await result;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    //FORGOT PASSWORD REQUEST TO COGNITO USER POOL
    async forgotPassword(
        forgotPasswordDto: ForgotPasswordDto,
    ): Promise<ForgotPasswordResponse> {
        const result: Promise<ForgotPasswordResponse> = this.cognitoClient
            .forgotPassword({
                ClientId: this.cognitoConfig.appClient.ClientId,
                Username: forgotPasswordDto.email,
            })
            .promise();

        try {
            return await result;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    //CONFIRM PASSWORD TO COGNITO USER POOL
    async confirmForgotPassword(
        confirmForgotPasswordDto: ConfirmForgotPasswordDto,
    ): Promise<ConfirmForgotPasswordResponse> {
        const result: Promise<ConfirmForgotPasswordResponse> = this.cognitoClient
            .confirmForgotPassword({
                ClientId: this.cognitoConfig.appClient.ClientId,
                ConfirmationCode: confirmForgotPasswordDto.code,
                Password: confirmForgotPasswordDto.password,
                Username: confirmForgotPasswordDto.email,
            })
            .promise();

        try {
            return await result;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    //LOGOUT FROM COGNITO USER POOL
    async logout(refreshToken: any): Promise<GlobalSignOutResponse> {
        const { token } = refreshToken;
        const result: Promise<GlobalSignOutResponse> = this.cognitoClient
            .globalSignOut({
                AccessToken: token,
            })
            .promise();

        try {
            return await result;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    //GET COGNITO USER FROM BEARER TOKEN
    async getUserByBearerToken(bearerToken: string): Promise<GetUserResponse> {
        const accessToken = this.extractToken(bearerToken);
        const result: Promise<GetUserResponse> = this.cognitoClient
            .getUser({
                AccessToken: accessToken,
            })
            .promise();

        try {
            return await result;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    //REFRESH COGNITO TOKENS
    async refreshTokens(refreshToken: any): Promise<InitiateAuthResponse> {
        const { token } = refreshToken;

        const result = this.cognitoClient
            .initiateAuth({
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId: this.configService.get('auth.appClientId'),
                AuthParameters: {
                    REFRESH_TOKEN: token,
                },
            })
            .promise();

        try {
            console.log('tokens refreshed')
            return await result;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    //LIST ALL COGNITO USERS
    async listUsers(): Promise<ListUsersResponse> {

        const result = this.cognitoClient
            .listUsers({
                UserPoolId: this.cognitoConfig.userPool.Id
            }).promise();

        try {
            return await result;
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException(error);
        }
    }

    //GET USER BY ID
    async getUserById(id: string): Promise<any> {
        const users = this.listUsers();

        try {
            const user = (await users).Users;
            return user.filter(u => u.Username.trim() === id.trim())
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException(error);
        }
    }

    //EXTRACT TOKEN STRING FROM BEARER TOKEN
    private extractToken(bearer: string): string {
        if (!bearer) {
            throw new UnauthorizedException();
        }
        const token = bearer.split(' ')[1];
        return token;
    }
}
