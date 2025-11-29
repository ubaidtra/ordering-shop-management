/**
 * Script to ensure admin user exists in the database
 * Run this after deployment to create/update admin user in production
 * 
 * Usage: node scripts/ensure-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Get admin credentials from environment variables or use defaults for development
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  
  if (password === 'changeme123') {
    console.warn('⚠️  WARNING: Using default password. Set ADMIN_PASSWORD environment variable for production!');
  }
  
  console.log('🔍 Checking admin user...');
  
  const normalizedEmail = email.toLowerCase().trim();
  const adminPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: normalizedEmail,
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user ensured:', admin.email);
  console.log('   Role:', admin.role);
  console.log('   Active:', admin.isActive);
  
  // Verify password
  const isValid = await bcrypt.compare(password, admin.password);
  console.log('   Password verified:', isValid ? '✅' : '❌');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

