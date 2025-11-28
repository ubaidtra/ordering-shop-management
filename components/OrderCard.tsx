import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderCardProps {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date | string;
  trackingCode?: string | null;
  showDetails?: boolean;
}

export function OrderCard({
  id,
  status,
  paymentStatus,
  totalAmount,
  createdAt,
  trackingCode,
  showDetails = true,
}: OrderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order #{id.slice(0, 8)}</h3>
          <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold">{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment:</span>
          <span
            className={paymentStatus === "PAID" ? "text-green-600" : "text-red-600"}
          >
            {paymentStatus}
          </span>
        </div>
        {trackingCode && (
          <div className="flex justify-between">
            <span className="text-gray-600">Tracking:</span>
            <span className="font-mono text-sm">{trackingCode}</span>
          </div>
        )}
      </div>
      {showDetails && (
        <Link href={`/orders/${id}`}>
          <button className="w-full text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            View Details →
          </button>
        </Link>
      )}
    </div>
  );
}
