import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { Prisma } from '@prisma/client';

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
        updatedBy: userId,
      },
    });
  }

  async find(findOptions: {
    pagination?: { page: number; limit: number };
    filters?: { localOccupation?: number; location?: string };
  }) {
    const { pagination, filters } = findOptions;
    console.log(filters);
    const queryParams: Prisma.ShelterFindManyArgs = {
      where: {},
    };

    if (pagination) {
      const { page, limit } = pagination;
      queryParams.skip = (page - 1) * limit;
      queryParams.take = limit;
    }

    if (filters) {
      const { localOccupation, location } = filters;
      console.log(localOccupation);

      if (localOccupation) {
        queryParams.where.occupation = {
          lt: localOccupation,
        };
      }

      if (location) {
        queryParams.where.location = location;
      }
    }
    console.log(queryParams);

    const filteredShelters = this.prisma.shelter.findMany(queryParams);

    return filteredShelters;
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
    if (updateShelterDto.email) {
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
      data: { ...updateShelterDto, updatedBy: userId },
    });
  }

  async remove(id: number) {
    return this.prisma.shelter.delete({
      where: { id },
    });
  }
}
