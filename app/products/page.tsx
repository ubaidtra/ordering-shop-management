"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  images: string;
  quantity: number;
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [types, setTypes] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter) params.append("type", typeFilter);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data);

      // Extract unique types
      const uniqueTypes = Array.from(new Set(data.map((p: Product) => p.type)));
      setTypes(uniqueTypes as string[]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Furniture Store
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600">
                About
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-indigo-600 font-medium">
                Products
              </Link>
              {session ? (
                <>
                  <Link href="/cart" className="text-gray-700 hover:text-indigo-600">
                    Cart
                  </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-indigo-600">
                    Orders
                  </Link>
                  <span className="text-gray-700">{session.user.name}</span>
                  <Link href="/api/auth/signout">
                    <Button variant="outline" size="sm">Logout</Button>
                  </Link>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="primary" size="sm">Login</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Products</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              options={[
                { value: "", label: "All Types" },
                ...types.map((t) => ({ value: t, label: t })),
              ]}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            No products found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}
