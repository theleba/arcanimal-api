import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/enums/role.enum';


export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ description: 'Role of the user in the system'})
  @IsEnum(Role)
  role: Role;
}
