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
    { email: 'arcanimal.dev@gmail.com', name: 'Admin ArcAnimal', password: 'ecadLEnDAyAn', role: 'admin', phone: '9999999999', updatedBy: 1 },
    { email: 'soulebarbosa@gmail.com', name: 'Admin DEV', password: 'Teste@123', role: 'admin', phone: '9999999999', updatedBy: 1 },
    { email: 'arcanimal.voluntarios@gmail.com', name: 'Voluntário ArcAnimal', password: 'ecadLEnDAyAn', role: 'volunteer', phone: '9999999999', updatedBy: 1 },
  ];

  const petsData = [
    { location: 'New York', contact: 'John Doe', gender: 'Male', breed: 'Labrador Retriever', size: 'Large', type: 'Dog', color: 'Golden', name: 'Max', url: 'https://example.com/max', found: false, details: 'Friendly and energetic dog, loves playing fetch.', updatedBy: 1 },
    { location: 'Los Angeles', contact: 'Jane Smith', gender: 'Female', breed: 'Maine Coon', size: 'Medium', type: 'Cat', color: 'Tabby', name: 'Luna', url: 'https://example.com/luna', found: true, details: 'Laid-back and affectionate cat, enjoys lounging in the sun.', updatedBy: 1 },
    { location: 'Chicago', contact: 'Michael Johnson', gender: 'Male', breed: 'German Shepherd', size: 'Large', type: 'Dog', color: 'Black and Tan', name: 'Rocky', url: 'https://example.com/rocky', found: false, details: 'Intelligent and loyal dog, great with kids.', updatedBy: 1 },
    { location: 'Houston', contact: 'Emily Brown', gender: 'Female', breed: 'Siamese', size: 'Small', type: 'Cat', color: 'Seal Point', name: 'Mia', url: 'https://example.com/mia', found: true, details: 'Curious and vocal cat, loves exploring new environments.', updatedBy: 1 },
    { location: 'Phoenix', contact: 'David Martinez', gender: 'Male', breed: 'Golden Retriever', size: 'Large', type: 'Dog', color: 'Golden', name: 'Charlie', url: 'https://example.com/charlie', found: false, details: 'Gentle and affectionate dog, enjoys swimming and long walks.', updatedBy: 1 },
    { location: 'Philadelphia', contact: 'Olivia Wilson', gender: 'Female', breed: 'Persian', size: 'Medium', type: 'Cat', color: 'White', name: 'Bella', url: 'https://example.com/bella', found: true, details: 'Regal and independent cat, prefers quiet environments.', updatedBy: 1 },
    { location: 'San Antonio', contact: 'Daniel Taylor', gender: 'Male', breed: 'Poodle', size: 'Small', type: 'Dog', color: 'Apricot', name: 'Buddy', url: 'https://example.com/buddy', found: false, details: 'Playful and intelligent dog, loves learning new tricks.', updatedBy: 1 },
    { location: 'San Diego', contact: 'Sophia Anderson', gender: 'Female', breed: 'Sphynx', size: 'Small', type: 'Cat', color: 'Pink', name: 'Lily', url: 'https://example.com/lily', found: true, details: 'Affectionate and curious cat, enjoys being the center of attention.', updatedBy: 1 },
    { location: 'Dallas', contact: 'James Thomas', gender: 'Male', breed: 'Border Collie', size: 'Medium', type: 'Dog', color: 'Black and White', name: 'Oreo', url: 'https://example.com/oreo', found: false, details: 'Energetic and intelligent dog, excels in agility training.', updatedBy: 1 },
    { location: 'San Jose', contact: 'Ava Garcia', gender: 'Female', breed: 'Bengal', size: 'Medium', type: 'Cat', color: 'Leopard', name: 'Zoe', url: 'https://example.com/zoe', found: true, details: 'Active and playful cat, enjoys interactive toys and games.', updatedBy: 1 }
  ];
  const sheltersData = [
    { location: 'New York', name: 'Big Apple Animal Shelter', email: 'info@bigapple.com', phone: '555-1234', capacity: 50, occupation: 25, description: 'A large animal shelter located in the heart of New York City.', needs: ['Pet food', 'Blankets', 'Volunteers'], updatedBy: 1 },
    { location: 'Los Angeles', name: 'Sunshine Shelter', email: 'info@sunshine.com', phone: '555-5678', capacity: 40, occupation: 20, description: 'A sunny shelter providing care for animals in Los Angeles.', needs: ['Toys', 'Medical supplies', 'Donations'], updatedBy: 1 },
    { location: 'Chicago', name: 'Windy City Animal Rescue', email: 'info@windycity.com', phone: '555-9012', capacity: 30, occupation: 15, description: 'A shelter dedicated to rescuing and rehoming animals in Chicago.', needs: ['Bedding', 'Cleaning supplies', 'Adoptive families'], updatedBy: 1 }
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

  const petCount = await prisma.pet.count();
  if (petCount === 0) {
    await prisma.pet.createMany({
      data: petsData,
      skipDuplicates: true,
    });
    console.log('Added default pets');
  } else {
    console.log('Default users already exist');


    const sheltercount = await prisma.shelter.count();
    if (sheltercount === 0) {
      await prisma.shelter.createMany({
        data: sheltersData,
        skipDuplicates: true,
      });
      console.log('Added default shelters');
    } else {
      console.log('Default shelters already exist');
    }
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
