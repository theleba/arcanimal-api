import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/enums/role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Full name of the user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Phone number of the user' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address of the user' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Password of the user' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: 'Role of the user in the system', enum: ['admin', 'volunteer'] })
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ description: 'UserId' })
  @IsNotEmpty()
  @IsInt()
  updatedBy: number; 
}
