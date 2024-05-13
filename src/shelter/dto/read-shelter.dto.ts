import { ApiProperty } from '@nestjs/swagger';

export class ShelterReadDto {
  @ApiProperty({ description: 'Unique identifier of the shelter' })
  id: number;

  @ApiProperty({ description: 'Location of the shelter' })
  location: string;

  @ApiProperty({ description: 'Name of the shelter' })
  name: string;

  @ApiProperty({ description: 'Email address of the shelter' })
  email: string;

  @ApiProperty({ description: 'Phone number of the shelter' })
  phone: string;

  @ApiProperty({ description: 'Capacity of the shelter' })
  capacity: number;

  @ApiProperty({ description: 'Current occupation of the shelter' })
  occupation: number;

  @ApiProperty({ description: 'Detailed description of the shelter' })
  description: string;

  @ApiProperty({ description: 'Current needs of the shelter' })
  needs: string;

  @ApiProperty({ description: 'Creation date of the shelter record' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the shelter record' })
  updatedAt: Date;
  @ApiProperty({description: 'Current other needs of the shelter record'})
other_needs:string;
}
