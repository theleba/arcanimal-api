import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiResponse({ status: 200, description: 'Returned all users successfully.' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
  
    return this.userService.findAll(page, limit);
  }

  @Get('role')
  @ApiOperation({ summary: 'Retrieve users by role with pagination' })
  @ApiQuery({ name: 'role', required: true })
  @ApiQuery({ name: 'page', required: true , type: 'number'})
  @ApiQuery({ name: 'limit', required: true , type: 'number'})
  @ApiResponse({ status: 200, description: 'Returned users with specified role.' })
  async findByRole(@Query('role') role: Role, @Query('page') page: number, @Query('limit') limit: number) {

    
    return this.userService.findAllWithRole(page, limit, role);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @Post('volunteer')
  @ApiOperation({ summary: 'Create a new volunteer' })
  @ApiResponse({ status: 201, description: 'Volunteer created successfully.' })
  async createVolunteer(@Body() createUserDto: CreateUserDto) {
    return this.userService.createVolunteer(createUserDto);
  }

  @Post('admin')
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: 201, description: 'Admin created successfully.' })
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }
}
