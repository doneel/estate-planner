import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const carrier = await prisma.carrier.create({
    data: {
      name: "United Car Insurance National",
    },
  });

  let gmail_org = await prisma.organization.findUnique({
    where: { domain: "gmail.com" },
  });
  if (gmail_org === null) {
    gmail_org = await prisma.organization.create({
      data: {
        domain: "gmail.com",
        name: "Demo Org",
      },
    });
  }

  const claimant_daniel = await prisma.claimant.create({
    data: {
      name: "Daniel O'Neel",
      email: "danieloneel@gmail.com",
      phone: "6504651359",
      organizationId: gmail_org?.id,
    },
  });

  const claim_daniel = await prisma.claim.create({
    data: {
      name: "My personal claim",
      file_number: "S0412162",
      claim_number: "293482",
      claimantId: claimant_daniel.id,
      carrierId: carrier.id,
      organizationId: gmail_org?.id,
    },
  });

  const claimant_john = await prisma.claimant.create({
    data: {
      name: "John Ziegler",
      email: "johnziegler4@gmail.com",
      phone: "6504651359",
      organizationId: gmail_org?.id,
    },
  });

  const claim_john = await prisma.claim.create({
    data: {
      name: "John Ziegler 2022-11",
      file_number: "S0413179",
      claim_number: "293483",
      claimantId: claimant_john.id,
      carrierId: carrier.id,
      createdAt: new Date(2022, 11, 1),
      receivedAt: new Date(2022, 11, 1),
      organizationId: gmail_org?.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
