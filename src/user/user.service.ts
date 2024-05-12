import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/enums/role.enum';
import { AuthService } from 'src/auth/auth.service';
import { UserReadDto } from './dto/read-user.dto';
import { EmailService } from 'src/mail/mail.service';
import { generateRandomPassword } from 'src/utils/generateRandomPassword';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private authService: AuthService, private mailService: EmailService) {}

private toReadUser(user: any): UserReadDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy
    };
  }

  private toReadUsers(users: any[]): UserReadDto[] {
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    updatedBy: user.updatedBy
  }));
}

  async createAdmin(createUserDto: CreateUserDto, createdByUserId: number) {

     const existingUser = await this.prisma.shelter.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

  const hashedPassword = await this.authService.hashPassword(createUserDto.password);

  const user = await this.prisma.user.create({
    data: {
      ...createUserDto,
      password: hashedPassword,
      role: Role.Admin, 
      updatedBy: createdByUserId,
    },
  });

  return this.toReadUser(user)

}

 async createVolunteer(createUserDto: CreateUserDto, createdByUserId: number) {

  const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

  const defaultPassword = generateRandomPassword(8);
  const hashedPassword = await this.authService.hashPassword(defaultPassword);

  const user = await this.prisma.user.create({
    data: {
      ...createUserDto,
      password: hashedPassword,
      role: Role.Volunteer, 
      updatedBy: createdByUserId,
    },
  });

 await this.mailService.sendWelcomeEmail({
    name: user.name,
    email: user.email, 
    password: defaultPassword
  });

  return this.toReadUser(user)
}

  async findAll(page: number, limit: number): Promise<UserReadDto[]> {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const users = await this.prisma.user.findMany({
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });

  return this.toReadUsers(users);
}

  async findAllWithRole(page: number, limit: number, role: Role) {

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const users = await this.prisma.user.findMany({
      where: {
        role: role,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    return this.toReadUsers(users);
  }

  async findAllWithoutPagination() {
    return this.prisma.user.findMany();
  }

   async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, updatedByUserId: number) {

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

    if(updateUserDto.password){
      const hashedPassword = await this.authService.hashPassword(updateUserDto.password);
      updateUserDto.password = hashedPassword
    }
     

    return this.prisma.user.update({
      where: { id: id },
      data: {...updateUserDto,
        updatedBy: updatedByUserId,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id: id },
    });
  }

  
}

