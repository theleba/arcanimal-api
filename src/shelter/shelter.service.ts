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

    // Parse Cadastro sheet
    const cadastroSheet = workbook.Sheets['Cadastro'];
    if (!cadastroSheet) {
      throw new BadRequestException('Sheet "cadastro" not found');
    }
    const cadastroData = XLSX.utils.sheet_to_json<Record<string, any>>(cadastroSheet);

    // Parse Monitoramento sheet
    const monitoramentoSheet = workbook.Sheets['Monitoramento'];
    if (!monitoramentoSheet) {
      throw new BadRequestException('Sheet "monitoramento" not found');
    }
    const monitoramentoData = XLSX.utils.sheet_to_json<Record<string, any>>(monitoramentoSheet);

    // Parse Necessidades sheet
    const necessidadesSheet = workbook.Sheets['Necessidades dos abrigos'];
    if (!necessidadesSheet) {
      throw new BadRequestException('Sheet "necessidades" not found');
    }
    const necessidadesData = XLSX.utils.sheet_to_json<Record<string, any>>(necessidadesSheet);

    const headers = Object.keys(necessidadesData[0]);
    const needKeys = headers.slice(1, headers.length); // Skip the first column which is the name of the shelter

    return cadastroData.map((data: Record<string, any>) => {
      const monitoramento = monitoramentoData.find((m: any) => m['Nome do abrigo'] === data['Nome do abrigo']);
      const necessidades = necessidadesData.find((n: any) => n['Nome do abrigo'] === data['Nome do abrigo']);

      const needs: string[] = [];
      if (necessidades) {
        needKeys.forEach((key) => {
          if (necessidades[key] === true || necessidades[key] === '✔' || necessidades[key] === '1' || necessidades[key] === 'TRUE') {
            needs.push(key);
          }
        });
      }

		const endereco = [data.Endereço, data.Bairro, data.CEP].filter(Boolean).join(' - ');

		const capacidadeTotal = monitoramento ? parseInt(monitoramento['Qual a capacidade total de animais do Abrigo?'], 10) : 0;
		const vagasDisponiveis = monitoramento ? parseInt(monitoramento['Número de vagas disponíveis'], 10) : 0;

		return {
			location: data.Cidade,
			address: endereco,
			name: data['Nome do abrigo'],
			email: data.Email,
			phone: String(data['Contato da pessoa responsável'] || '') ,
			capacity: capacidadeTotal,
			occupation: capacidadeTotal - vagasDisponiveis,
			owner: data['Nome da pessoa responsável'],
			needs: needs.map((need) => need.replace(/'$/, '')),
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
