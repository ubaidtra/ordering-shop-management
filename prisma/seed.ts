import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create operator user
  const operatorPassword = await bcrypt.hash("operator123", 10);
  const operator = await prisma.user.upsert({
    where: { email: "operator@example.com" },
    update: {},
    create: {
      email: "operator@example.com",
      password: operatorPassword,
      name: "Operator User",
      role: "OPERATOR" as const,
      isActive: true,
    },
  });

  // Create customer user
  const customerPassword = await bcrypt.hash("customerbuy", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer@furniture.com" },
    update: {},
    create: {
      email: "customer@furniture.com",
      password: customerPassword,
      name: "Customer User",
      role: "CUSTOMER" as const,
      isActive: true,
    },
  });

  // Create sample products (check if they exist first)
  const existingProducts = await prisma.product.findMany();
  if (existingProducts.length === 0) {
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Modern Sofa",
          type: "Furniture",
          color: "Gray",
          price: 599.99,
          size: "Large",
          description: "Comfortable modern sofa perfect for your living room",
          quantity: 10,
          images: JSON.stringify([]),
        },
      }),
      prisma.product.create({
        data: {
          name: "Wooden Dining Table",
          type: "Furniture",
          color: "Brown",
          price: 399.99,
          size: "Medium",
          description: "Beautiful wooden dining table for 6 people",
          quantity: 5,
          images: JSON.stringify([]),
        },
      }),
      prisma.product.create({
        data: {
          name: "Office Chair",
          type: "Furniture",
          color: "Black",
          price: 149.99,
          size: "Standard",
          description: "Ergonomic office chair with lumbar support",
          quantity: 20,
          images: JSON.stringify([]),
        },
      }),
    ]);
    // Products seeded successfully
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
