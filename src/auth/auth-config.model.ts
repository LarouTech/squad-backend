/* eslint-disable prettier/prettier */
export interface AuthConfig {
  appClient: {
    ClientId: string;
    UserPoolId: string;
    ClientName: string;
  };
  userPool: {
    Id: string;
    Name: string;
    LambdaConfig: any;
    LastModifiedDate: Date;
    CreationDate: Date;
  };
}
