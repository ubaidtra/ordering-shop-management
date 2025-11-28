import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        operator: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check access
    if (
      session.user.role !== "ADMIN" &&
      order.customerId !== session.user.id &&
      order.operatorId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, paymentStatus, trackingCode, operatorId } = body;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === "OPERATOR") {
      if (order.operatorId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Operators can only update status and tracking code
      const updateData: any = {};
      if (status) updateData.status = status;
      if (trackingCode !== undefined) updateData.trackingCode = trackingCode;

      const updatedOrder = await prisma.order.update({
        where: { id: params.id },
        data: updateData,
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return NextResponse.json(updatedOrder);
    } else if (session.user.role === "ADMIN") {
      // Admins can update everything
      const updateData: any = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      if (trackingCode !== undefined) updateData.trackingCode = trackingCode;
      if (operatorId !== undefined) updateData.operatorId = operatorId;

      const updatedOrder = await prisma.order.update({
        where: { id: params.id },
        data: updateData,
        include: {
          customer: true,
          operator: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return NextResponse.json(updatedOrder);
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
