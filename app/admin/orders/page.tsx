"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OrderCard } from "@/components/OrderCard";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";

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
  operator: {
    name: string;
  } | null;
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user.role !== "ADMIN") {
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

  const handleStatusUpdate = async (orderId: string, field: string, value: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/admin" className="text-2xl font-bold text-indigo-600">
              Admin Dashboard
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/admin/products">
                <Button variant="outline" size="sm">Products</Button>
              </Link>
              <Link href="/admin/operators">
                <Button variant="outline" size="sm">Operators</Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="primary" size="sm">Orders</Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="outline" size="sm">Logout</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500">Customer: {order.customer.name}</p>
                  <p className="text-sm text-gray-500">Email: {order.customer.email}</p>
                  {order.operator && (
                    <p className="text-sm text-gray-500">
                      Operator: {order.operator.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select
                    options={[
                      { value: "PENDING", label: "PENDING" },
                      { value: "ACCEPTED", label: "ACCEPTED" },
                      { value: "SHIPPED", label: "SHIPPED" },
                      { value: "DELIVERED", label: "DELIVERED" },
                      { value: "CANCELLED", label: "CANCELLED" },
                    ]}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, "status", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <Select
                    options={[
                      { value: "PAID", label: "PAID" },
                      { value: "UNPAID", label: "UNPAID" },
                    ]}
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, "paymentStatus", e.target.value)
                    }
                  />
                </div>
              </div>

              {order.trackingCode && (
                <p className="text-sm text-gray-600">
                  Tracking: <span className="font-mono">{order.trackingCode}</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">No orders yet.</div>
        )}
      </div>
    </div>
  );
}
