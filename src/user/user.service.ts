import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/enums/role.enum';
import { AuthService } from 'src/auth/auth.service';
import { UserReadDto } from './dto/read-user.dto';
import { EmailService } from 'src/mail/mail.service';
import { generateRandomPassword } from 'src/utils/generateRandomPassword';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService, 
		private authService: AuthService, 
		private mailService: EmailService
	) {}

	private toReadUser(user: any): UserReadDto {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			phone: user.phone,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			updatedBy: user.updatedBy
		};
	}

	private toReadUsers(users: any[]): UserReadDto[] {
		return users.map(user => ({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			phone: user.phone,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			updatedBy: user.updatedBy
		}));
	}

	async createAdmin(createUserDto: CreateUserDto, createdByUserId: number) {

		const existingUser = await this.prisma.user.findUnique({
			where: {
				email: createUserDto.email,
			},
		});

		if (existingUser) {
		throw new ConflictException('Email already exists');
		}

  		const hashedPassword = await this.authService.hashPassword(createUserDto.password);

		const user = await this.prisma.user.create({
			data: {
				...createUserDto,
				password: hashedPassword,
				role: Role.Admin, 
				updatedBy: createdByUserId,
			},
		});

		return this.toReadUser(user)

	}

 	async createVolunteer(createUserDto: CreateUserDto, createdByUserId: number) {

		const existingUser = await this.prisma.user.findUnique({
			where: {
				email: createUserDto.email,
			},
		});

		if (existingUser) {
			throw new ConflictException('Email already exists');
		}

		const defaultPassword = generateRandomPassword(8);
		const hashedPassword = await this.authService.hashPassword(defaultPassword);

		const user = await this.prisma.user.create({
			data: {
				...createUserDto,
				password: hashedPassword,
				role: Role.Volunteer, 
				updatedBy: createdByUserId,
			},
		});

		await this.mailService.sendWelcomeEmail({
			name: user.name,
			email: user.email, 
			password: defaultPassword
		});

 	 return this.toReadUser(user)

}

	async resetUserPassword(email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new ConflictException('Usuário não encontrado.');
		}

		const newPassword = generateRandomPassword(8);
		const hashedPassword = await this.authService.hashPassword(newPassword);

		await this.prisma.user.update({
			where: { email },
			data: { password: hashedPassword },
		});

		await this.mailService.sendRecoverPasswordEmail({
			name: user.name,
			email: user.email,
			password: newPassword  
		});

 		 return { message: "Senha resetada com sucesso e e-mail enviado." };

	}


	async findAll(page?: number, limit?: number): Promise<{ data: UserReadDto[], total: number }> {

		let queryParams: any = {};
		if (page) {
			const pageNumber = Number(page);
			queryParams.skip = (pageNumber - 1) * limit;
			queryParams.take = limit;
		}

		const users = await this.prisma.user.findMany(queryParams);
		const total = await this.prisma.user.count();

		return { data: this.toReadUsers(users), total };
	}


	async findAllWithRole(role: Role, page?: number, limit?: number ): Promise<{ data: UserReadDto[], total: number }> {

		let queryParams: any = {
			where: { role: role }
		};
		if (page) {
			const pageNumber = Number(page);
			queryParams.skip = (pageNumber - 1) * limit;
			queryParams.take = limit;
		}

		const users = await this.prisma.user.findMany(queryParams);
		const total = await this.prisma.user.count({ where: { role: role } });

		return { data: this.toReadUsers(users), total };
	}


 	 async update(id: number, updateUserDto: UpdateUserDto, updatedByUserId: number) {

		if(updateUserDto.email) {
		const existingUser = await this.prisma.user.findUnique({
			where: {
			email: updateUserDto.email,
			},
		});

		if (existingUser && existingUser.id !== id) {
			throw new ConflictException('Email already exists');
		}
		}

		if(updateUserDto.password){
		const hashedPassword = await this.authService.hashPassword(updateUserDto.password);
		updateUserDto.password = hashedPassword
		}
     

		return this.prisma.user.update({
		where: { id: id },
		data: {...updateUserDto,
			updatedBy: updatedByUserId,
		},
		});
 	}

	async remove(id: number) {
		return this.prisma.user.delete({
			where: { id: id },
		});
	}

}

