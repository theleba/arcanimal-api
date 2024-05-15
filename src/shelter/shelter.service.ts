import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { Prisma } from '@prisma/client';
import { ShelterCsvParser } from './shelter-csv-parser';

@Injectable()
export class ShelterService {
	constructor(private prisma: PrismaService, private csvParser: ShelterCsvParser) {}

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

  async importCsv(csv: Express.Multer.File, userId: number) {
    const shelters = await this.csvParser.parse(csv);

    const sheltersEmails = shelters.map(({ email }) => email);

    if (sheltersEmails.length !== new Set(sheltersEmails).size) {
      throw new BadRequestException('Duplicated emails on CSV file');
    }

    const existentEmails = await this.prisma.shelter.findMany({
      select: {
        email: true,
      },
      where: {
        email: { in: sheltersEmails },
      },
    });

    if (existentEmails.length > 0) {
      throw new BadRequestException(
        `Email(s) [${existentEmails.map(({ email }) => email).join(', ')}] already exists`,
      );
    }

    return this.prisma.shelter.createMany({
      data: shelters.map((shelter) => ({ ...shelter, updatedBy: userId })),
    });
  }


	async find(findOptions: {
		pagination?: { page: number; limit: number };
		filters?: { localOccupation?: number; location?: string };
	}) {
		const { pagination, filters } = findOptions;
		const queryParams: Prisma.ShelterFindManyArgs = {
			where: {},
		};

		if (pagination && pagination.page) {
			const { page, limit } = pagination;
			queryParams.skip = (page - 1) * limit;
			queryParams.take = limit;
		}

		if (filters) {
			const { localOccupation, location } = filters;

			if (localOccupation) {
				queryParams.where.occupation = {
				lt: localOccupation,
				};
			}

			if (location) {
				queryParams.where.location = location;
			}
		}

		const filteredShelters = await this.prisma.shelter.findMany(queryParams);

		const total = await this.prisma.shelter.count({ where: queryParams.where });

		return { data: filteredShelters, total };

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
