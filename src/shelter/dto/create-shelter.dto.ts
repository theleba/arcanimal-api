import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShelterDto {
  @ApiProperty({ description: 'Location of the shelter' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: 'Address of the shelter' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Name of the shelter' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the shelter' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Phone number of the shelter' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Available spaces of the shelter in terms of number of pets it can accommodate' })
  @IsInt()
  @IsOptional()
  occupation?: number;

  @ApiProperty({ description: 'Available spaces of the shelter in terms of number of pets it can accommodate' })
  @IsInt()
  @IsOptional()
  capacity?: number;

  @ApiProperty({ description: 'Detailed owner of the shelter', example:'' })
  @IsString()
  @IsOptional()
  owner: string;

  @ApiProperty({ description: 'Current needs of the shelter' })
  @IsArray()
  @IsOptional()
  needs: string[];

  @ApiProperty({ description: 'Other needs of the shelter' })
  @IsString()
  other_needs: string;

}
