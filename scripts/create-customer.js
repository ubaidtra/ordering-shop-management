const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const customerPassword = await bcrypt.hash('customerbuy', 10);
  
  const customer = await prisma.user.upsert({
    where: { email: 'customer@furniture.com' },
    update: {
      password: customerPassword,
      name: 'Customer User',
      role: 'CUSTOMER',
      isActive: true,
    },
    create: {
      email: 'customer@furniture.com',
      password: customerPassword,
      name: 'Customer User',
      role: 'CUSTOMER',
      isActive: true,
    },
  });

  console.log('Customer user created/updated:', customer.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
