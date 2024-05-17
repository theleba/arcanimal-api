import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateShelterDto {
  @ApiPropertyOptional({ description: 'Location of the shelter' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Address of the shelter' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiPropertyOptional({ description: 'Name of the shelter' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Email address of the shelter' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number of the shelter' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Available spaces of the shelter in terms of number of pets it can accommodate' })
  @IsInt()
  @Min(0)
  @IsOptional()
  spaces?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  ocuppation: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  capacity: number;

  @ApiPropertyOptional({ description: 'Detailed owner of the shelter', example:'' })
  @IsString()
  @IsOptional()
  owner?: string;

  @ApiPropertyOptional({ description: 'Current needs of the shelter' })
  @IsArray()
  @IsOptional()
  needs?: string[];

  @ApiPropertyOptional({ description: 'Other needs of the shelter' })
  @IsString()
  other_needs: string;

}
