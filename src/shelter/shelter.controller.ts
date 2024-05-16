import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	Query,
	UseGuards,
  UseInterceptors,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiQuery,
	ApiBearerAuth,
	ApiConsumes,
	ApiBody,
} from '@nestjs/swagger';
import { ShelterService } from './shelter.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserId } from 'src/decorators/get-user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('shelters')
@Controller('shelters')
export class ShelterController {
	constructor(private readonly shelterService: ShelterService) {}

	@ApiBearerAuth('BearerAuth')
	@UseGuards(AuthGuard('jwt'))
	@Post()
	@ApiOperation({ summary: 'Create a new shelter' })
	@ApiResponse({ status: 201, description: 'Shelter created successfully.' })
	async create(
		@Body() createShelterDto: CreateShelterDto,
		@GetUserId() userId: number,
	) {
		return this.shelterService.create(createShelterDto, userId);
	}


	 @ApiBearerAuth('BearerAuth')
  @UseGuards(AuthGuard('jwt'))
  @Post('import-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import shelters data from XLSX file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async importData(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUserId() userId: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.shelterService.importData(file, userId);
  }

	@Get()
	@ApiOperation({ summary: 'Retrieve all shelters with optional pagination' })
	@ApiQuery({ name: 'page', required: false, type: 'number' })
	@ApiQuery({ name: 'localOccupation', required: false, type: 'number' })
	@ApiQuery({ name: 'location', required: false, type: 'string' })
	@ApiResponse({
		status: 200,
		description: 'Returned all shelters successfully.',
	})
	async find(
		@Query('page') page?: number,
		@Query('localOccupation') localOccupation?: number,
		@Query('location') location?: string,
	) {
		const pagination = page ? { page, limit: Number(process.env.PAGE_LIMIT) } : undefined; 
		const filters = { localOccupation, location };
		const findOptions = { pagination, filters };
		return this.shelterService.find(findOptions);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Retrieve a shelter by id' })
	@ApiResponse({ status: 200, description: 'Shelter found.' })
	async findOne(@Param('id') id: number) {
		return this.shelterService.findOne(id);
	}

	@ApiBearerAuth('BearerAuth')
	@UseGuards(AuthGuard('jwt'))
	@Put(':id')
	@ApiOperation({ summary: 'Update a shelter by id' })
	@ApiResponse({ status: 200, description: 'Shelter updated successfully.' })
	async update(
		@Param('id') id: number,
		@Body() updateShelterDto: UpdateShelterDto,
		@GetUserId() userId: number,
	) {
		return this.shelterService.update(id, updateShelterDto, userId);
	}

	@ApiBearerAuth('BearerAuth')
	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	@ApiOperation({ summary: 'Delete a shelter by id' })
	@ApiResponse({ status: 200, description: 'Shelter deleted successfully.' })
	async remove(@Param('id') id: number) {
		return this.shelterService.remove(id);
	}
}
