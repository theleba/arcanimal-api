import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';

@Injectable()
export class ShelterService {
  constructor(private prisma: PrismaService) {}

  async create(createShelterDto: CreateShelterDto, userId: number) {

     const existingShelter = await this.prisma.shelter.findUnique({
      where: {
        email: createShelterDto.email,
      },
    });

    if (existingShelter) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.shelter.create({
      data: {
        ...createShelterDto,
        updatedBy: userId
      },
    });
  }

  async findAll(page: number, limit: number) {

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    return this.prisma.shelter.findMany({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });
  }

  async findAllWithoutPagination() {
    return this.prisma.shelter.findMany();
  }

  async findOne(id: number) {
    return this.prisma.shelter.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateShelterDto: UpdateShelterDto, userId: number) {

    if(updateShelterDto.email) {
     const existingShelter = await this.prisma.shelter.findUnique({
      where: {
        email: updateShelterDto.email,
      },
    });

    if (existingShelter && existingShelter.id !== id) {
      throw new ConflictException('Email already exists');
    }
    }
    return this.prisma.shelter.update({
      where: { id },
      data: {...updateShelterDto, 
        updatedBy: userId },
    });
  }

  async remove(id: number) {
    return this.prisma.shelter.delete({
      where: { id },
    });
  }
}
