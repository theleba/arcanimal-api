import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class PetService {
	constructor(private prisma: PrismaService, private imagesService: ImagesService) {}

	async create(createPetDto: CreatePetDto) {
		const { shelterId, imageBase64, ...rest } = createPetDto;

		let imagePath = null;
		if (imageBase64) {
			imagePath = await this.imagesService.saveImage(imageBase64);
		}

		return this.prisma.pet.create({
			data: {
				...rest,
				Shelter: {
					connect: { id: shelterId },
				},
				url: imagePath
			},
		});
	}

	async findAll(page: number, limit: number) {

		let queryParams: any = {};
		if (page) {
			const pageNumber = Number(page);
			queryParams.skip = (pageNumber - 1) * limit;
			queryParams.take = limit;
		}

		const pets = await this.prisma.pet.findMany(queryParams);
		const total = await this.prisma.pet.count();
		return {data: pets, total}

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
