"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

interface Product {
  id: string;
  name: string;
  type: string;
  color: string | null;
  price: number;
  size: string | null;
  description: string | null;
  quantity: number;
  images: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, fetchProduct]);

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setAdding(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          quantity: parseInt(quantity.toString()),
        }),
      });

      if (response.ok) {
        alert("Product added to cart!");
        router.push("/cart");
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Product not found</div>
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const mainImage = (images.length > 0 && images[0]) ? images[0] : "/placeholder.svg";
  const inStock = product.quantity > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Furniture Store
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/products" className="text-gray-700 hover:text-indigo-600">
                Products
              </Link>
              {session && (
                <>
                  <Link href="/cart" className="text-gray-700 hover:text-indigo-600">
                    Cart
                  </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-indigo-600">
                    Orders
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative h-96 w-full bg-gray-200 rounded-lg">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-xl text-indigo-600 font-semibold">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="space-y-2">
                <p><span className="font-medium">Type:</span> {product.type}</p>
                {product.color && (
                  <p><span className="font-medium">Color:</span> {product.color}</p>
                )}
                {product.size && (
                  <p><span className="font-medium">Size:</span> {product.size}</p>
                )}
                <p>
                  <span className="font-medium">Stock:</span>{" "}
                  {inStock ? (
                    <span className="text-green-600">{product.quantity} available</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </p>
              </div>

              {product.description && (
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {inStock && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    {adding ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
