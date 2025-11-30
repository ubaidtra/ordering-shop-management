"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";

interface Operator {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminOperatorsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      fetchOperators();
    }
  }, [status, session, router]);

  const fetchOperators = async () => {
    try {
      // We'll need to create an API endpoint for this
      const response = await fetch("/api/admin/operators");
      if (response.ok) {
        const data = await response.json();
        setOperators(data);
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/operators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ email: "", name: "", password: "" });
        fetchOperators();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create operator");
      }
    } catch (error) {
      console.error("Error creating operator:", error);
      alert("An error occurred");
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/operators/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchOperators();
      }
    } catch (error) {
      console.error("Error updating operator:", error);
    }
  };

  const handleEdit = (operator: Operator) => {
    setSelectedOperator(operator);
    setEditFormData({
      name: operator.name,
      email: operator.email,
      password: "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperator) return;

    try {
      const updateData: any = {
        name: editFormData.name,
        email: editFormData.email,
      };

      // Only include password if it was provided
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const response = await fetch(`/api/admin/operators/${selectedOperator.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        setSelectedOperator(null);
        setEditFormData({ name: "", email: "", password: "" });
        fetchOperators();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update operator");
      }
    } catch (error) {
      console.error("Error updating operator:", error);
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete operator "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/operators/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchOperators();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete operator");
      }
    } catch (error) {
      console.error("Error deleting operator:", error);
      alert("An error occurred");
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
                <Button variant="primary" size="sm">Operators</Button>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Operators</h1>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
          >
            Add Operator
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operators.map((operator) => (
            <Card key={operator.id}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {operator.name}
              </h3>
              <p className="text-gray-600 mb-1">{operator.email}</p>
              <p className="text-xs text-gray-400 mb-4">
                Created: {new Date(operator.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    operator.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {operator.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(operator.id, operator.isActive)}
                  className="text-xs"
                >
                  {operator.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(operator)}
                  className="text-xs"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(operator.id, operator.name)}
                  className="text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {operators.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No operators yet. Click &quot;Add Operator&quot; to create one.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ email: "", name: "", password: "" });
        }}
        title="Add Operator"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setFormData({ email: "", name: "", password: "" });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOperator(null);
          setEditFormData({ name: "", email: "", password: "" });
        }}
        title="Edit Operator"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={editFormData.email}
            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            required
          />
          <Input
            label="Password (leave blank to keep current)"
            type="password"
            value={editFormData.password}
            onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
            placeholder="Enter new password or leave blank"
          />
          <p className="text-xs text-gray-500">
            Leave password blank if you don&apos;t want to change it.
          </p>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedOperator(null);
                setEditFormData({ name: "", email: "", password: "" });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
