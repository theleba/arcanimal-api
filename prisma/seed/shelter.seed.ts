import { PrismaClient,Role } from '@prisma/client'


export async function shelterSeed(prisma:PrismaClient) {
    const shelters = [
      { 
        name: 'Grêmio Náutico União',
       location: 'R. Quintino Bocaiúva, 500 - Moinhos de Vento, Porto Alegre - RS, 90440-050',
       email: 'arcanimal.dev@gmail.com',
       phone:"",
       capacity:50 ,
       occupation:50,
        description:"Lorem Ipsin",
        needs:["água"],
        updatedBy:0
    },
    { 
        name: 'Grêmio Náutico União',
       location: 'R. Quintino Bocaiúva, 500 - Moinhos de Vento, Porto Alegre - RS, 90440-050',
       email: 'arcanimal.dev@gmail.com',
       phone:"",
       capacity:50 ,
       occupation:50,
        description:"Lorem Ipsin",
        needs:["água"],
        updatedBy:0
    }
    
    ];
    
    for (let shelter of shelters) {
      await prisma.shelter.upsert({
        where: { email: shelter.email},
        update: {},
        create:{
          ...shelter
        },
      })
    }
  }
  