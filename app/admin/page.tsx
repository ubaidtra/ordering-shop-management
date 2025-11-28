"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
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
      fetchStats();
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);

      const orders = await ordersRes.json();
      const products = await productsRes.json();

      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o: any) => o.status === "PENDING").length;
      const totalRevenue = orders
        .filter((o: any) => o.paymentStatus === "PAID")
        .reduce((sum: number, o: any) => sum + o.totalAmount, 0);
      const totalProducts = products.length;

      setStats({
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalProducts,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
            <nav className="flex items-center space-x-4">
              <Link href="/admin/products">
                <Button variant="outline" size="sm">Products</Button>
              </Link>
              <Link href="/admin/operators">
                <Button variant="outline" size="sm">Operators</Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">Orders</Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="outline" size="sm">Logout</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Products</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalProducts}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Products</h3>
              <p className="text-gray-600">Add, edit, or remove products from the store</p>
            </Card>
          </Link>
          <Link href="/admin/operators">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Operators</h3>
              <p className="text-gray-600">Create and manage operator accounts</p>
            </Card>
          </Link>
          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Orders</h3>
              <p className="text-gray-600">View and manage all customer orders</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
