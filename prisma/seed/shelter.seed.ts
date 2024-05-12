import { PrismaClient, Role } from '@prisma/client'


export async function shelterSeed(prisma: PrismaClient) {
  const shelters = [
    {
      name: 'Grêmio Náutico União',
      location: 'R. Quintino Bocaiúva, 500 - Moinhos de Vento, Porto Alegre - RS, 90440-050',
      email: 'arcanimal.dev@gmail.com',
      phone: "",
      capacity: 50,
      occupation: 50,
      // description: "Abrigo dedicado ao resgate e cuidado de cães e gatos abandonados.",
      needs: ["água"],
      updatedBy: 0
    },
    {
      name: "Amigos Peludos",
      location: "Av. Paulista, 1000 - São Paulo, SP, 01310-100",
      email: "amigospeludos@gmail.com",
      phone: "+55 11 1234-5678",
      capacity: 80,
      occupation: 65,
      // description: "Abrigo dedicado ao resgate e cuidado de cães e gatos abandonados.",
      needs: ["ração", "medicamentos", "cobertores"],
      updatedBy: 0
    },
    {
      name: "Patas Amigas",
      location: "Calle de la Amistad, 200 - Madrid, Spain, 28001",
      email: "patasamigas@gmail.com",
      phone: "+34 91 234 5678",
      capacity: 50,
      occupation: 40,
      // description: "Um santuário para cães e gatos abandonados, onde eles recebem amor e cuidado enquanto aguardam por adoção.",
      needs: ["vacinas", "brinquedos", "camas"],
      updatedBy: 0
    },
    {
      name: "Patas Livres",
      location: "Rua das Amizades, 123 - Rio de Janeiro, RJ, 20000-000",
      email: "pataslivres@example.com",
      phone: "+55 21 98765-4321",
      capacity: 60,
      occupation: 55,
      // description: "Um santuário acolhedor para cães, gatos e outros animais resgatados, onde recebem cuidados amorosos e atenção especial.",
      needs: ["cobertores", "ração especial", "voluntários para passeios"],
      updatedBy: 0
    },
    {
      name: "AuAu Haven",
      location: "123 Oak Street, Anytown, USA, 54321",
      email: "info@furryhaven.org",
      phone: "+1 (555) 123-4567",
      capacity: 40,
      occupation: 30,
      // description: "Um abrigo dedicado ao bem-estar e à reabilitação de animais maltratados e abandonados, oferecendo-lhes um lar amoroso e seguro.",
      needs: ["camas confortáveis", "brinquedos interativos", "adoções responsáveis"],
      updatedBy: 0
    },
    {
      name: "Coeur de Poil",
      location: "Rue de l'Amitié, 456 - Paris, France, 75000",
      email: "contact@coeurdepoil.fr",
      phone: "+33 1 2345 6789",
      capacity: 35,
      occupation: 25,
      // description: "Um refúgio para animais de estimação em situações de emergência ou abandono, oferecendo cuidados médicos e emocionais.",
      needs: ["vacinas", "areia para gatos", "doações de alimentos saudáveis"],
      updatedBy: 0
    }

  ];

  for (let shelter of shelters) {
    await prisma.shelter.upsert({
      where: { email: shelter.email },
      update: {},
      create: {
        ...shelter
      },
    })
  }
}
