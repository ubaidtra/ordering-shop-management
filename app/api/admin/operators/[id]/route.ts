import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { isActive, name, email, password } = body;

    // Build update data object
    const updateData: any = {};
    
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    
    if (name) {
      updateData.name = name;
    }
    
    if (email) {
      // Normalize email
      updateData.email = email.toLowerCase().trim();
    }
    
    if (password) {
      // Hash the new password
      updateData.password = await bcrypt.hash(password, 10);
    }

    const operator = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(operator);
  } catch (error) {
    console.error("Error updating operator:", error);
    return NextResponse.json({ error: "Failed to update operator" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the operator has assigned orders
    const operatorWithOrders = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        assignedOrders: {
          where: {
            status: {
              in: ["PENDING", "ACCEPTED", "SHIPPED"]
            }
          }
        }
      }
    });

    if (operatorWithOrders?.assignedOrders && operatorWithOrders.assignedOrders.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete operator with ${operatorWithOrders.assignedOrders.length} active orders. Please reassign or complete these orders first.` },
        { status: 400 }
      );
    }

    // Delete the operator
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Operator deleted successfully" });
  } catch (error) {
    console.error("Error deleting operator:", error);
    return NextResponse.json({ error: "Failed to delete operator" }, { status: 500 });
  }
}
