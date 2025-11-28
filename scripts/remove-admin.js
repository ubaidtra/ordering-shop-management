/**
 * Script to remove existing admin account(s)
 * This allows the one-time admin signup feature to be used again
 * 
 * Usage: node scripts/remove-admin.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Searching for admin accounts...');
  
  // Find all admin users
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (admins.length === 0) {
    console.log('✅ No admin accounts found.');
    return;
  }

  console.log(`Found ${admins.length} admin account(s):`);
  admins.forEach(admin => {
    console.log(`  - ${admin.email} (${admin.name})`);
  });

  // Delete all admin accounts
  const result = await prisma.user.deleteMany({
    where: { role: 'ADMIN' },
  });

  console.log(`\n✅ Deleted ${result.count} admin account(s).`);
  console.log('🎉 Admin signup feature is now available again!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

