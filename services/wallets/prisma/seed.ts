import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEED_USER = "player@crash-game.dev";
const INITIAL_DEPOSIT = 100_000; // R$ 1.000,00 em centavos

async function seed() {
  const existing = await prisma.wallet.findUnique({
    where: { owner: SEED_USER },
  });

  if (existing) {
    console.log(`Seed: wallet for ${SEED_USER} already exists, skipping.`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.wallet.create({
      data: {
        owner: SEED_USER,
        balance: INITIAL_DEPOSIT,
        status: "ACTIVE",
      },
    });

    await tx.ledger.create({
      data: {
        userEmail: SEED_USER,
        amount: INITIAL_DEPOSIT,
        type: "DEPOSIT",
      },
    });
  });

  console.log(
    `Seed: wallet created for ${SEED_USER} with balance R$ ${INITIAL_DEPOSIT / 100}.`,
  );
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
