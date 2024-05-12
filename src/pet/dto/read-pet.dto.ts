import { ApiProperty } from '@nestjs/swagger';

export class PetReadDto {
  @ApiProperty({ description: 'The unique identifier of the pet' })
  id: number;

  @ApiProperty({ description: 'Location where the pet is found' })
  location: string;

  @ApiProperty({ description: 'Contact number for pet inquiries' })
  contact: string;

  @ApiProperty({ description: 'Gender of the pet' })
  gender: string;

  @ApiProperty({ description: 'Breed of the pet' })
  breed: string;

  @ApiProperty({ description: 'Size of the pet' })
  size: string;

  @ApiProperty({ description: 'Type of the animal' })
  type: string;

  @ApiProperty({ description: 'Color of the pet' })
  color: string;

  @ApiProperty({ description: 'Name of the pet' })
  name: string;

  @ApiProperty({ description: 'URL to pet details' })
  url: string;

  @ApiProperty({ description: 'Found status of the pet' })
  found: boolean;

  @ApiProperty({ description: 'Details about the pet' })
  details: string;

  @ApiProperty({ description: 'Identifier of the shelter this pet belongs to' })
  shelterId: number;

  @ApiProperty({ description: 'Creation date of the record' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the record' })
  updatedAt: Date;
}
