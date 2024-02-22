import prisma from "../lib/prisma";
import { faker } from "@faker-js/faker";

async function createProducts(): Promise<void> {
  await prisma.product.deleteMany();
  for (let i = 0; i < 100; i++) {
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        category: faker.commerce.department(),
        imageUrl: faker.image.avatar(),
      },
    });
  }
}
async function createStaffMembers(): Promise<void> {
  await prisma.staffMember.deleteMany();
  for (let i = 0; i < 5; i++) {
    await prisma.staffMember.create({
      data: {
        name: faker.person.fullName(),
      },
    });
  }
}

async function main() {
  createProducts();
  createStaffMembers();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
