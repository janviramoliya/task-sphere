import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(['USER', 'ADMIN'])
  role?: string;
}
