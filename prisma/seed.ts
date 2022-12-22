import { PrismaClient } from "@prisma/client";
import { gmail } from "googleapis/build/src/apis/gmail";

const prisma = new PrismaClient();

async function seed() {
  /*
  const stytchId = "none";
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const user = await prisma.user.create({
    data: {
      stytchUserId: stytchId,
      email,
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });
  */

  const carrier = await prisma.carrier.create({
    data: {
      name: "United Car Insurance National",
    },
  });

  const gmail_org = await prisma.organization.findUniqueOrThrow({
    where: { domain: "gmail.com" },
  });

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
