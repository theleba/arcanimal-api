import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as Papa from 'papaparse';
import { CreateShelterDto } from './dto/create-shelter.dto';

@Injectable()
export class ShelterCsvParser {
  async parse(csv: Express.Multer.File) {
    const csvContent = String(csv.buffer);

    const { data: parsedData } = Papa.parse(csvContent, {
      skipEmptyLines: true,
    });

    if (parsedData.length <= 1) {
      throw new BadRequestException('Invalid CSV');
    }

    parsedData.shift(); // Remove header

    const shelters = (parsedData as string[])
      .map(
        ([
          name,
          address,
          location,
          email,
          phone,
          capacity,
          occupation,
          owner,
          needs,
          other_needs,
        ]) => ({
          name,
          address,
          location,
          email,
          phone,
          capacity: Number(capacity),
          occupation: Number(occupation),
          owner,
          needs: needs.split('|'),
          other_needs,
        }),
      )
      .map((rawShelter) => plainToInstance(CreateShelterDto, rawShelter));

    const errors = (
      await Promise.all(
        shelters.map(async (shelter, index) => {
          const shelterErrors = await validate(shelter);

          return {
            lineNumber: index,
            errors: shelterErrors.flatMap(({ constraints }) =>
              Object.values(constraints),
            ),
          };
        }),
      )
    ).filter((shelterPromise) => shelterPromise.errors.length > 0);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return shelters;
  }
}
