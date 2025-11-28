"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/Button";

export default function AboutPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">
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
            About Us
          </h1>
          <p className="text-xl mb-8 animate-slide-in">
            Your trusted partner for quality furniture and materials
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded with a passion for quality and customer satisfaction, our furniture store
              has been serving customers with premium furniture and materials for years. We
              believe that every home deserves beautiful, durable, and affordable furniture.
            </p>
            <p className="text-gray-600">
              Our commitment to excellence drives us to source the finest materials and work
              with skilled craftsmen to bring you furniture that combines style, comfort, and
              durability.
            </p>
          </div>
          <div className="animate-slide-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To provide high-quality furniture and materials that enhance the beauty and
              functionality of your living spaces while maintaining affordable prices and
              exceptional customer service.
            </p>
            <p className="text-gray-600">
              We strive to make furniture shopping a seamless and enjoyable experience for
              everyone, from first-time buyers to interior design enthusiasts.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                We source only the finest materials and ensure every product meets our
                high standards.
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We&apos;re here to help you find the perfect
                furniture for your needs.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Affordability</h3>
              <p className="text-gray-600">
                We believe quality furniture should be accessible to everyone at fair and
                competitive prices.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> info@furniture.com
                </p>
                <p>
                  <span className="font-medium">Phone:</span> +1 (555) 123-4567
                </p>
                <p>
                  <span className="font-medium">Address:</span> 123 Furniture Street, City, State 12345
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
