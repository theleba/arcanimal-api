import { ApiProperty } from '@nestjs/swagger';

export class UserReadDto {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: number;

  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @ApiProperty({ description: 'Phone number of the user' })
  phone: string;

  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @ApiProperty({ description: 'Role of the user in the system' })
  role: string;

  @ApiProperty({ description: 'Creation date of the user account' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the user account' })
  updatedAt: Date;
}
