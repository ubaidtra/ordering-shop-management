"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/Button";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data);
        if (!data.items || data.items.length === 0) {
          router.push("/cart");
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, router, fetchCart]);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    setProcessing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/orders");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Furniture Store
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-xl">
              <span className="font-bold">Total</span>
              <span className="font-bold text-indigo-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
          <p className="text-gray-600">
            Payment status will be updated manually by the admin after order confirmation.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/cart" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Back to Cart
            </Button>
          </Link>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
