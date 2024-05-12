import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ShelterService } from './shelter.service';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserId } from 'src/decorators/get-user-id.decorator';

@ApiBearerAuth('BearerAuth')
@UseGuards(AuthGuard('jwt'))
@ApiTags('shelters')
@Controller('shelters')
export class ShelterController {
  constructor(private readonly shelterService: ShelterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shelter' })
  @ApiResponse({ status: 201, description: 'Shelter created successfully.' })
  async create(@Body() createShelterDto: CreateShelterDto, @GetUserId() userId: number) {
    return this.shelterService.create(createShelterDto, userId);
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
  async update(@Param('id') id: number, @Body() updateShelterDto: UpdateShelterDto, @GetUserId() userId: number) {
    return this.shelterService.update(id, updateShelterDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shelter by id' })
  @ApiResponse({ status: 200, description: 'Shelter deleted successfully.' })
  async remove(@Param('id') id: number) {
    return this.shelterService.remove(id);
  }
}
