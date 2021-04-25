/* eslint-disable prettier/prettier */
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsAlphanumeric()
  password: string;
}
