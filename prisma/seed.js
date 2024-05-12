// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function hashPassword(password) {
  const saltRounds = 10; 
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function main() {
  const users = [
    { email: 'arcanimal.dev@gmail.com', name: 'Admin ArcAnimal', password: 'ecadLEnDAyAn', role:'admin' },
    { email: 'soulebarbosa@gmail.com', name: 'Admin DEV', password: 'Teste@123', role:'admin'  },
    { email: 'arcanimal.voluntarios@gmail.com', name: 'Voluntário ArcAnimal', password: 'ecadLEnDAyAn', role:'volunteer'  }
  ];

  for (let user of users) {
    user.password = await hashPassword(user.password); 
  }

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    await prisma.user.createMany({
      data: users,
      skipDuplicates: true, 
    });
    console.log('Added default users with hashed passwords');
  } else {
    console.log('Default users already exist');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
