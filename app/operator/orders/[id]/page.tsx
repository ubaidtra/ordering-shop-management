"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string;
  };
}

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
  items: OrderItem[];
}

export default function OperatorOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    trackingCode: "",
  });

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setFormData({
          status: data.status,
          trackingCode: data.trackingCode || "",
        });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user.role !== "OPERATOR") {
      router.push("/");
      return;
    }
    if (status === "authenticated" && params.id) {
      fetchOrder();
    }
  }, [status, session, params.id, router, fetchOrder]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchOrder();
        alert("Order updated successfully!");
      } else {
        alert("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/operator" className="text-2xl font-bold text-indigo-600">
              Operator Dashboard
            </Link>
            <Link href="/api/auth/signout">
              <Button variant="outline" size="sm">Logout</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/operator">
          <Button variant="outline" size="sm" className="mb-6">
            ← Back to Orders
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <p className="text-gray-600">{order.customer.name}</p>
              <p className="text-gray-600">{order.customer.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
              <p className="text-gray-600">
                Payment Status:{" "}
                <span
                  className={
                    order.paymentStatus === "PAID" ? "text-green-600" : "text-red-600"
                  }
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p className="text-xl font-bold text-indigo-600 mt-2">
                Total: {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => {
                const images = item.product.images
                  ? JSON.parse(item.product.images)
                  : [];
                const imageUrl = (images.length > 0 && images[0]) ? images[0] : "/placeholder.svg";

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleUpdate} className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Update Order</h3>
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
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Code
                </label>
                <Input
                  value={formData.trackingCode}
                  onChange={(e) =>
                    setFormData({ ...formData, trackingCode: e.target.value })
                  }
                  placeholder="Enter tracking code"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Order"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
