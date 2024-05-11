import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createAdmin(createUserDto: CreateUserDto) {

     const existingUser = await this.prisma.shelter.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }


  return this.prisma.user.create({
    data: {
      ...createUserDto,
      role: Role.Admin, 
    },
  });
}

 async createVolunteer(createUserDto: CreateUserDto) {

  const existingUser = await this.prisma.shelter.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

  return this.prisma.user.create({
    data: {
      ...createUserDto,
      role: Role.Volunteer, 
    },
  });
}

  async findAll(page: number, limit: number) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

  return this.prisma.user.findMany({
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });
  }

  async findAllWithRole(page: number, limit: number, role: Role) {

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    return this.prisma.user.findMany({
      where: {
        role: role,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });
  }

  async findAllWithoutPagination() {
    return this.prisma.user.findMany();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

  

    if(updateUserDto.email) {
     const existingUser = await this.prisma.shelter.findUnique({
      where: {
        email: updateUserDto.email,
      },
    });

    if (existingUser && existingUser.id !== id) {
      throw new ConflictException('Email already exists');
    }
    }


    return this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id: id },
    });
  }

  
}
