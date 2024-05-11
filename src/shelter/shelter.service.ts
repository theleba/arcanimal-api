import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';

@Injectable()
export class ShelterService {
  constructor(private prisma: PrismaService) {}

  async create(createShelterDto: CreateShelterDto) {

     const existingShelter = await this.prisma.shelter.findUnique({
      where: {
        email: createShelterDto.email,
      },
    });

    if (existingShelter) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.shelter.create({
      data: createShelterDto,
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

  async update(id: number, updateShelterDto: UpdateShelterDto) {

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
      data: updateShelterDto,
    });
  }

  async remove(id: number) {
    return this.prisma.shelter.delete({
      where: { id },
    });
  }
}
