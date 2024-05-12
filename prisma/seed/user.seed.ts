import { PrismaClient,Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'


async function hashPassword(password) {
    const saltRounds = 10; 
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  
  export async function userSeed(prisma:PrismaClient) {
    const users = [
      { email: 'arcanimal.dev@gmail.com', name: 'Admin ArcAnimal', password: 'ecadLEnDAyAn', role: Role.admin, phone:"",
      updatedBy: 0 },
      { email: 'soulebarbosa@gmail.com', name: 'Admin DEV', password: 'Teste@123', role:Role.admin, phone:"",
      updatedBy: 0 },
      { email: 'arcanimal.voluntarios@gmail.com', name: 'Voluntário ArcAnimal', password: 'ecadLEnDAyAn', role:Role.volunteer, phone:"",
      updatedBy: 0  }
    ];
    
    for (let user of users) {
      user.password = await hashPassword(user.password);  
      await prisma.user.upsert({
        where: { email: user.email},
        update: {},
        create:{...user},
      })
    }
  }
  