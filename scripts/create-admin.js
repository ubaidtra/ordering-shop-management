const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Get admin credentials from environment variables or use defaults for development
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  
  if (adminPassword === 'changeme123') {
    console.warn('⚠️  WARNING: Using default password. Set ADMIN_PASSWORD environment variable for production!');
  }
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin user created/updated:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
