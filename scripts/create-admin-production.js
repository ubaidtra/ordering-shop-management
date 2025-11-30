/**
 * Script to create admin account in production database
 * 
 * Usage:
 *   1. Get DATABASE_URL from Vercel Dashboard → Settings → Environment Variables
 *   2. Run: $env:DATABASE_URL="your-vercel-database-url" ; node scripts/create-admin-production.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'ubaidtra@gmail.com';
  const password = 'ubaid@281986';
  const name = 'Admin User';
  
  console.log('🔍 Connecting to production database...');
  console.log('   Database URL:', process.env.DATABASE_URL ? 'Set ✅' : 'Not set ❌');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
    console.error('   Please set it first:');
    console.error('   $env:DATABASE_URL="mongodb+srv://..." ; node scripts/create-admin-production.js');
    process.exit(1);
  }
  
  console.log('🔍 Creating/updating admin account...');
  
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists with this email.');
      console.log('   Updating password and role...');
      
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
    
    console.log('\n🎉 Admin account is ready!');
    console.log('   You can now login at your Vercel app with:');
    console.log('   Email: ubaidtra@gmail.com');
    console.log('   Password: ubaid@281986');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('connect')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check your DATABASE_URL is correct');
      console.error('   2. Verify MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)');
      console.error('   3. Check if database name exists in connection string');
    }
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

