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
  
  console.log('Checking admin user...');
  
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    console.error('❌ Admin user NOT FOUND!');
    console.log('Creating admin user...');
    
    const adminPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
      },
    });
    
    console.log('✅ Admin user created:', admin.email);
  } else {
    console.log('✅ Admin user found:', user.email);
    console.log('   Role:', user.role);
    console.log('   Active:', user.isActive);
    console.log('   Name:', user.name);
    
    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    console.log('   Password valid:', isValid ? '✅' : '❌');
    
    if (!isValid) {
      console.log('⚠️  Password mismatch! Updating password...');
      const newPasswordHash = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email: email.toLowerCase().trim() },
        data: { password: newPasswordHash },
      });
      console.log('✅ Password updated!');
    }
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

