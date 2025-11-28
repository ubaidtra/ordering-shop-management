import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, contact, address, adminCode } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Handle admin signup (one-time only)
    if (adminCode) {
      // Check if admin signup is allowed (no admin exists yet)
      const existingAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: "Admin account already exists. Admin signup is disabled." },
          { status: 403 }
        );
      }

      // Verify admin code
      const validAdminCode = process.env.ADMIN_SIGNUP_CODE || "ADMIN_SETUP_2024";
      if (adminCode !== validAdminCode) {
        return NextResponse.json(
          { error: "Invalid admin signup code" },
          { status: 403 }
        );
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "ADMIN",
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return NextResponse.json(
        { message: "Admin account created successfully", user },
        { status: 201 }
      );
    }

    // Regular customer signup
    if (!contact || !address) {
      return NextResponse.json(
        { error: "Contact and address are required for customer signup" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        contact,
        address,
        role: "CUSTOMER",
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
