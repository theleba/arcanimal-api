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
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiQuery,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { ShelterService } from './shelter.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserId } from 'src/decorators/get-user-id.decorator';

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
