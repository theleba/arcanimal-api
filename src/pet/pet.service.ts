import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class PetService {
  constructor(private prisma: PrismaService, private fileService: FileService) {}

  async create(createPetDto: CreatePetDto) {
    const { shelterId, imageBase64, ...rest } = createPetDto;

    let url: string | null = null;
    if (imageBase64) {
      url = await this.fileService.saveImage(imageBase64);
    }

    return this.prisma.pet.create({
      data: {
        ...rest,
        url, 
        Shelter: {
          connect: { id: shelterId },
        },
      },
    });
  }

  async findAll(page: number, limit: number) {

     const pageNumber = Number(page);
    const limitNumber = Number(limit);


    return this.prisma.pet.findMany({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });
  }

  async findAllWithoutPagination() {
    return this.prisma.pet.findMany();
  }

  async findOne(id: number) {
    return this.prisma.pet.findUnique({
      where: { id },
    });
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    return this.prisma.pet.update({
      where: { id },
      data: updatePetDto,
    });
  }

  async remove(id: number) {
    return this.prisma.pet.delete({
      where: { id },
    });
  }
}
