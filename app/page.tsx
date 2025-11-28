"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string;
  quantity: number;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.slice(0, 6)); // Show first 6 products
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Furniture Store
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600">
                About
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-indigo-600">
                Products
              </Link>
              {session ? (
                <>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="text-gray-700 hover:text-indigo-600">
                      Admin
                    </Link>
                  )}
                  {session.user.role === "OPERATOR" && (
                    <Link href="/operator" className="text-gray-700 hover:text-indigo-600">
                      Operator
                    </Link>
                  )}
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
                <>
                  <Link href="/signup">
                    <Button variant="outline" size="sm">Sign Up</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="primary" size="sm">Login</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Welcome to Our Furniture Store
          </h1>
          <p className="text-xl mb-8 animate-slide-in">
            Discover quality furniture and materials for your home
          </p>
          <Link href="/products">
            <Button variant="secondary" size="lg">Browse Products</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                All our products are carefully selected and tested to ensure the highest quality standards.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing without compromising on quality. Great value for your money.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery service to get your furniture to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products">
            <Button variant="outline" size="md">View All Products</Button>
          </Link>
        </div>
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
            No products available yet.
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Browse our collection and find the perfect furniture for your home
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products">
              <Button variant="secondary" size="lg">Shop Now</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
