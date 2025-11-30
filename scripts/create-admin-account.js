/**
 * Script to create a single admin account
 * 
 * Usage (local database):
 *   node scripts/create-admin-account.js
 * 
 * Usage (production database):
 *   $env:DATABASE_URL="mongodb+srv://..." ; node scripts/create-admin-account.js
 * 
 * Or set DATABASE_URL in .env file
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Use DATABASE_URL from environment if set, otherwise uses default from .env
const prisma = new PrismaClient();

async function main() {
  const email = 'ubaidtra@gmail.com';
  const password = 'ubaid@281986';
  const name = 'Admin User';
  
  console.log('🔍 Creating admin account...');
  
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  
  if (existingAdmin) {
    console.log('⚠️  Admin account already exists with this email.');
    console.log('   Updating password...');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });
    
    console.log('✅ Admin account updated:');
    console.log('   Email:', updated.email);
    console.log('   Role:', updated.role);
    console.log('   Active:', updated.isActive);
  } else {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name,
        role: 'ADMIN',
        isActive: true,
      },
    });
    
    console.log('✅ Admin account created successfully:');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   Active:', admin.isActive);
  }
  
  // Verify password
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  const isValid = await bcrypt.compare(password, user.password);
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

