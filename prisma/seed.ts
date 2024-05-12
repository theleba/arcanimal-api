import { PrismaClient,Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password) {
    const saltRounds = 10; 
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  
  async function main() {
    const users = [
      { email: 'arcanimal.dev@gmail.com', name: 'Admin ArcAnimal', password: 'ecadLEnDAyAn', role: Role.admin },
      { email: 'soulebarbosa@gmail.com', name: 'Admin DEV', password: 'Teste@123', role:Role.admin },
      { email: 'arcanimal.voluntarios@gmail.com', name: 'Voluntário ArcAnimal', password: 'ecadLEnDAyAn', role:Role.volunteer  }
    ];
    
    for (let user of users) {
      user.password = await hashPassword(user.password);  
      await prisma.user.upsert({
        where: { email: user.email},
        update: {},
        create:{
          email:user.email, 
          name: user.name,
          password: user.password, 
          role:user.role,
          phone:"",
          updatedBy: 0
        },
      })
    }
   

  }
  main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })