import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ShelterService } from './shelter.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';

@ApiTags('shelters')
@Controller('shelters')
export class ShelterController {
  constructor(private readonly shelterService: ShelterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shelter' })
  @ApiResponse({ status: 201, description: 'Shelter created successfully.' })
  async create(@Body() createShelterDto: CreateShelterDto) {
    return this.shelterService.create(createShelterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all shelters with optional pagination' })
  @ApiQuery({ name: 'page', required: false , type: 'number' })
  @ApiQuery({ name: 'limit', required: false , type: 'number' })
  @ApiResponse({ status: 200, description: 'Returned all shelters successfully.' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    if (page && limit) {
      return this.shelterService.findAll(page, limit);
    }
    return this.shelterService.findAllWithoutPagination();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a shelter by id' })
  @ApiResponse({ status: 200, description: 'Shelter found.' })
  async findOne(@Param('id') id: number) {
    return this.shelterService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a shelter by id' })
  @ApiResponse({ status: 200, description: 'Shelter updated successfully.' })
  async update(@Param('id') id: number, @Body() updateShelterDto: UpdateShelterDto) {
    return this.shelterService.update(id, updateShelterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shelter by id' })
  @ApiResponse({ status: 200, description: 'Shelter deleted successfully.' })
  async remove(@Param('id') id: number) {
    return this.shelterService.remove(id);
  }
}
