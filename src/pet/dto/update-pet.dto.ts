import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePetDto {
  @ApiPropertyOptional({ description: 'Location where the pet was found or is located' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Contact information for the person or shelter associated with the pet' })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiPropertyOptional({ description: 'Gender of the pet' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Breed of the pet' })
  @IsString()
  @IsOptional()
  breed?: string;

  @ApiPropertyOptional({ description: 'Size of the pet' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({ description: 'Type of animal (e.g., dog, cat)' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Detailed description of the pet' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ description: 'Color of the pet' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: 'Name of the pet' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'URL to a photo of the pet' })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ description: 'Whether the pet has been found' })
  @IsBoolean()
  @IsOptional()
  found?: boolean;
}
