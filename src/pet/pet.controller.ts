import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('pets')
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({ status: 201, description: 'Pet created successfully.' })
  async create(@Body() createPetDto: CreatePetDto) {
    return this.petService.create(createPetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all pets with optional pagination' })
  @ApiQuery({ name: 'page', required: false , type: 'number' })
  @ApiQuery({ name: 'limit', required: false , type: 'number' })
  @ApiResponse({ status: 200, description: 'Returned all pets successfully.' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    if (page && limit) {
      return this.petService.findAll(page, limit);
    }
    return this.petService.findAllWithoutPagination();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a pet by id' })
  @ApiResponse({ status: 200, description: 'Pet found.' })
  async findOne(@Param('id') id: number) {
    return this.petService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a pet by id' })
  @ApiResponse({ status: 200, description: 'Pet updated successfully.' })
  async update(@Param('id') id: number, @Body() updatePetDto: UpdatePetDto) {
    return this.petService.update(id, updatePetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pet by id' })
  @ApiResponse({ status: 200, description: 'Pet deleted successfully.' })
  async remove(@Param('id') id: number) {
    return this.petService.remove(id);
  }
}
