import { prisma } from "./prisma";

export async function assignOrderToOperator(orderId: string): Promise<string | null> {
  // Find all active operators
  const operators = await prisma.user.findMany({
    where: {
      role: "OPERATOR",
      isActive: true,
    },
  });

  if (operators.length === 0) {
    return null;
  }

  // Count pending orders for each operator
  const operatorWorkloads = await Promise.all(
    operators.map(async (operator) => {
      const pendingCount = await prisma.order.count({
        where: {
          operatorId: operator.id,
          status: {
            in: ["PENDING", "ACCEPTED"],
          },
        },
      });
      return { operatorId: operator.id, pendingCount };
    })
  );

  // Sort by workload (ascending) and pick the operator with least pending orders
  operatorWorkloads.sort((a, b) => a.pendingCount - b.pendingCount);
  const assignedOperatorId = operatorWorkloads[0].operatorId;

  // Update the order with the assigned operator
  await prisma.order.update({
    where: { id: orderId },
    data: { operatorId: assignedOperatorId },
  });

  return assignedOperatorId;
}
