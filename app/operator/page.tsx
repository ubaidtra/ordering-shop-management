"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OrderCard } from "@/components/OrderCard";
import { Button } from "@/components/Button";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  trackingCode: string | null;
  customer: {
    name: string;
    email: string;
  };
}

export default function OperatorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user.role !== "OPERATOR") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "ACCEPTED");
  const shippedOrders = orders.filter((o) => o.status === "SHIPPED");
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600">Operator Dashboard</h1>
            <Link href="/api/auth/signout">
              <Button variant="outline" size="sm">Logout</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingOrders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Shipped Orders</h3>
            <p className="text-3xl font-bold text-purple-600">{shippedOrders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Delivered Orders</h3>
            <p className="text-3xl font-bold text-green-600">{deliveredOrders.length}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assigned Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No orders assigned to you yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Link key={order.id} href={`/operator/orders/${order.id}`}>
                <div className="cursor-pointer">
                  <OrderCard {...order} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
