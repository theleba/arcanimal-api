import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { Prisma } from '@prisma/client';
import { ShelterCsvParser } from './shelter-csv-parser';
import * as XLSX from 'xlsx';

@Injectable()
export class ShelterService {
	constructor(private prisma: PrismaService, private csvParser: ShelterCsvParser) {}

	async create(createShelterDto: CreateShelterDto, userId: number) {
	
		return this.prisma.shelter.create({
			data: {
				...createShelterDto,
				updatedBy: userId,
			},
		});
	}

	async importData(file: Express.Multer.File, userId: number) {
    const shelters = this.parseFile(file);
  
    return this.prisma.shelter.createMany({
      data: shelters.map((shelter) => ({ ...shelter, updatedBy: userId })),
    });
  }

  	private parseFile(file: Express.Multer.File): CreateShelterDto[] {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    const cadastroSheet = workbook.Sheets['Cadastro'];
    if (!cadastroSheet) {
      throw new BadRequestException('Sheet "cadastro" not found');
    }
    const cadastroData = XLSX.utils.sheet_to_json(cadastroSheet);

    const monitoramentoSheet = workbook.Sheets['Monitoramento'];
    if (!monitoramentoSheet) {
      throw new BadRequestException('Sheet "monitoramento" not found');
    }
    const monitoramentoData = XLSX.utils.sheet_to_json(monitoramentoSheet);

    // Parse Necessidades sheet
    const necessidadesSheet = workbook.Sheets['Necessidades dos abrigos'];
    if (!necessidadesSheet) {
      throw new BadRequestException('Sheet "necessidades" not found');
    }
    const necessidadesData = XLSX.utils.sheet_to_json(necessidadesSheet);

    return cadastroData.map((data: any) => {
      const monitoramento = monitoramentoData.find((m: any) => m.name === data.name);
      const necessidades = necessidadesData.find((n: any) => n.name === data.name);

      const needs = [];
      for (let i = 1; i <= 15; i++) {
        if (necessidades[`B${i}`]) {
          needs.push(necessidades[`B${i}`]);
        }
      }

      return {
        location: data.Cidade,
        address: `${data.Endereço} - ${data.Bairro} - ${data.CEP}`,
        name: data['Nome do abrigo'],
        email: data.Email,
        phone: String(data['Contato da pessoa responsável'] )|| '-',
        spaces: monitoramento ? monitoramento['Número de vagas disponíveis'] : null,
        owner: data['Nome da pessoa responsável'],
        needs,
        other_needs: '',
      };
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
				queryParams.where.spaces = {
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
