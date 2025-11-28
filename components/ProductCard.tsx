import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "./Button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string;
  quantity: number;
}

export function ProductCard({ id, name, price, images, quantity }: ProductCardProps) {
  let imageUrl = "/placeholder.svg";
  try {
    const parsedImages = images ? JSON.parse(images) : [];
    if (Array.isArray(parsedImages) && parsedImages.length > 0 && parsedImages[0]) {
      imageUrl = parsedImages[0];
    }
  } catch (e) {
    // Invalid JSON, use placeholder
  }
  const inStock = quantity > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      <Link href={`/products/${id}`}>
        <div className="relative h-48 w-full bg-gray-200">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-indigo-600">{formatPrice(price)}</p>
          {!inStock && (
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
        <Link href={`/products/${id}`} className="mt-4 block">
          <Button variant="primary" size="sm" className="w-full" disabled={!inStock}>
            {inStock ? "View Details" : "Out of Stock"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
