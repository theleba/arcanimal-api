import { IsBoolean, IsNotEmpty, IsString, IsUrl, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty({ description: 'Location where the pet was found or is located' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: 'Contact information for the person or shelter associated with the pet' })
  @IsNotEmpty()
  @IsString()
  contact: string;

  @ApiProperty({ description: 'Gender of the pet' })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Breed of the pet' })
  @IsNotEmpty()
  @IsString()
  breed: string;

  @ApiProperty({ description: 'Size of the pet' })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({ description: 'Type of animal (e.g., dog, cat)' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Detailed description of the pet', required: false })
  @IsString()
  @IsOptional()
  details: string;

  @ApiProperty({ description: 'Color of the pet' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({ description: 'Name of the pet' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Photo of the pet', required: false })
  @IsUrl()
  @IsOptional()
  url: string;

  @ApiProperty({ description: 'Base54 of photo of the pet', required: false })
  @IsString()
  @IsNotEmpty()
  imageBase64?: string;

  @ApiProperty({ description: 'Whether the pet has been found' })
  @IsBoolean()
  found: boolean;

  @IsNotEmpty()
  @IsInt()
  shelterId: number; 
}
